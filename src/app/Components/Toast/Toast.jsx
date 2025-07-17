"use client";

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const Toast = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          //Triggering the notification display
          addNotification({
            type: "info",
            title: payload.new.title,
            description: `A new comment was added on task ${taskName}`,
          });
        }
      )
      .subscribe();

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, event_type")
      .order("event_time", { ascending: false });

    if (error) {
      console.log("error fetching the notifications");
    }

    try {
      if (data && data.length > 0) {
        setNotifications(data);
        data.map((n) => {
          console.log("Title:", n.title);
          console.log("Event Type:", n.event_type);
        });
      }
    } catch (error) {
      console.log("notification not found");
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => id != notification.id)
    );
  };
  return (
    <>
      <div className="top-5 right-5 fixed z-30 flex-col gap-5">
        {notifications.map((notification) => {
          return (
            <div
              key={notification.id}
              className="bg-white border-l-green-500 border-l-4 rounded-lg p-4 shadow-lg
                           border border-gray-200 min-w-80 max-w-96 cursor-pointer relative
                           hover:shadow-xl transition-shadow duration-200 mt-4">
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"></path>
                </svg>
              </button>
              <div className="pr-6">
                {" "}
                {/* Added padding-right for close button */}
                <div className="font-semibold text-gray-800 text-sm mb-1">
                  {notification.event_type}
                </div>
                <div className="font-light text-gray-600 text-sm">
                  {notification.title}
                </div>
                <div className="text-gray-400 text-xs mt-2">Just now</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Toast;
