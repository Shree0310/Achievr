"use client";

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const NotificationToast = ({ notification, onRemove }) => {
  return (
    <div className="top-5 right-5 fixed z-30 flex-col gap-5">
      <div className="...">
        <div className="font-semibold text-gray-800 text-sm mb-1">
          {notification.title}
        </div>
        <div className="font-light text-gray-600 text-sm">
          {notification.message}
        </div>
      </div>
    </div>
  );
};
export default NotificationToast;
