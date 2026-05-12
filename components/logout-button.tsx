"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      leftIcon={<LogOut className="h-3.5 w-3.5" />}
    >
      Đăng xuất
    </Button>
  );
}
