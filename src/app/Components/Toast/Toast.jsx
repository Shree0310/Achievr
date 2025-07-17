"use client";

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const Toast = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
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
  return (
    <>
      <div className="top-5 right-5 fixed z-30 flex-col gap-5">
        <div
          className={`bg-white border-l-green-700 border-l-4 rounded-lg p-4 shadow-lg
                      border-neutral-400 min-w-80 max-w-96 min-h-32 max-h-44 cursor-pointer relative`}>
          {notifications.map((notification) => {
            return (
              <div key={notification.id}>
                <div className="font-semibold text-lg">
                  {notification.event_type}
                </div>
                <div className="font-light text-neutral-500 text-sm">
                  {notification.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Toast;
