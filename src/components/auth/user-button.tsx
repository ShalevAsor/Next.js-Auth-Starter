// /**
//  * Modern User Button Component
//  * A comprehensive dropdown menu for user-related actions and information.
//  */
// "use client";

// import { useTheme } from "next-themes";
// import { logout } from "@/actions/auth/logout";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import {
//   User,
//   Settings,
//   Lock,
//   Key,
//   LogOut,
//   Sun,
//   Moon,
//   Shield,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { SettingsModal } from "./settings-modal";
// interface UserButtonProps {
//   // Whether to show settings in modal instead of navigating
//   useModal?: boolean;
// }
// export const UserButton = ({ useModal }: UserButtonProps) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const router = useRouter();
//   const { theme, setTheme } = useTheme();
//   const user = useCurrentUser();
//   const handleSettingsClick = (e: React.MouseEvent) => {
//     if (useModal) {
//       setIsModalOpen(true);
//     } else {
//       router.push("/settings");
//     }
//   };

//   // Generate initials for avatar fallback
//   const initials = user?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger className="focus:outline-none">
//           <div className="flex items-center gap-x-2 cursor-pointer hover:opacity-75 transition">
//             <Avatar className="h-10 w-10">
//               <AvatarImage src={user?.image || ""} />
//               <AvatarFallback className="bg-sky-500 text-white">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>
//           </div>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-60">
//           <DropdownMenuLabel>
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium">{user?.name}</p>
//               <p className="text-xs text-muted-foreground">{user?.email}</p>
//               <div className="flex items-center gap-x-2">
//                 {(user?.isTwoFactorEnabled || user?.isOAuth) && (
//                   <span className="text-xs bg-emerald-500/15 text-emerald-500 px-2 py-1 rounded-md">
//                     Verified
//                   </span>
//                 )}
//                 {user?.role === "ADMIN" && (
//                   <span className="text-xs bg-blue-500/15 text-blue-500 px-2 py-1 rounded-md">
//                     Admin
//                   </span>
//                 )}
//               </div>
//             </div>
//           </DropdownMenuLabel>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem asChild>
//             <button
//               className="w-full flex items-center text-sm"
//               onClick={handleSettingsClick}
//             >
//               <Settings className="h-4 w-4 mr-2" />
//               Settings
//             </button>
//           </DropdownMenuItem>

//           {user?.role === "ADMIN" && (
//             <DropdownMenuItem onClick={() => router.push("/admin")}>
//               <Shield className="h-4 w-4 mr-2" />
//               Admin Dashboard
//             </DropdownMenuItem>
//           )}

//           {user?.isTwoFactorEnabled ? (
//             <DropdownMenuItem>
//               <Lock className="h-4 w-4 mr-2 text-emerald-500" />
//               2FA Enabled
//             </DropdownMenuItem>
//           ) : (
//             <DropdownMenuItem onClick={handleSettingsClick}>
//               <Key className="h-4 w-4 mr-2 text-destructive" />
//               Enable 2FA
//             </DropdownMenuItem>
//           )}

//           <DropdownMenuItem
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//           >
//             {theme === "dark" ? (
//               <Sun className="h-4 w-4 mr-2" />
//             ) : (
//               <Moon className="h-4 w-4 mr-2" />
//             )}
//             Toggle Theme
//           </DropdownMenuItem>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem
//             className="text-destructive focus:text-destructive"
//             onClick={async () => await logout()}
//           >
//             <LogOut className="h-4 w-4 mr-2" />
//             Log out
//           </DropdownMenuItem>
//           {isModalOpen && (
//             <SettingsModal
//               open={isModalOpen}
//               onClose={() => setIsModalOpen(false)}
//             />
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <SettingsModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </>
//   );
// };
/**
 * Modern User Button Component
 * A comprehensive dropdown menu for user-related actions and information.
 * Features include user profile display, settings access, theme toggling,
 * and role-based options like admin access and 2FA management.
 */
"use client";

import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { logout } from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Settings, Lock, Key, LogOut, Sun, Moon, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingsModal } from "./settings-modal";

// Props interface defining whether settings should open in a modal
interface UserButtonProps {
  useModal?: boolean;
}

export const UserButton = ({ useModal }: UserButtonProps) => {
  // State management for modal and dropdown visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for the dropdown trigger button - used for focus management
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Hooks for navigation, theme management, and user data
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useCurrentUser();

  /**
   * Handles clicks on the settings button.
   * Either opens the modal or navigates to settings page based on useModal prop.
   * Prevents event propagation to avoid conflicts with dropdown behavior.
   */
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Close dropdown before taking any action
    setIsDropdownOpen(false);

    if (useModal) {
      setIsModalOpen(true);
    } else {
      router.push("/settings");
    }
  };

  /**
   * Handles modal closure and ensures focus returns to the trigger button
   * This maintains proper focus management for accessibility
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    // Return focus to the button that opened the modal
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  /**
   * Generates user initials from their name for the avatar fallback
   * Takes first letter of each word in name and joins them
   */
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        {/* Dropdown Trigger Button */}
        <DropdownMenuTrigger
          ref={triggerRef}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || "User avatar"}
            />
            <AvatarFallback className="bg-sky-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* Dropdown Content */}
        <DropdownMenuContent
          align="end"
          className="w-60"
          onCloseAutoFocus={(e) => {
            // Prevent focus return if modal is opening
            if (isModalOpen) {
              e.preventDefault();
            }
          }}
        >
          {/* User Information Section */}
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>

              {/* User Status Badges */}
              <div className="flex items-center gap-x-2">
                {/* Verification Badge */}
                {(user?.isTwoFactorEnabled || user?.isOAuth) && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-500 px-2 py-1 rounded-md">
                    Verified
                  </span>
                )}
                {/* Admin Badge */}
                {user?.role === "ADMIN" && (
                  <span className="text-xs bg-blue-500/15 text-blue-500 px-2 py-1 rounded-md">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Settings Button */}
          <DropdownMenuItem asChild>
            <button
              className="w-full flex items-center text-sm px-2 py-1.5"
              onClick={handleSettingsClick}
              role="menuitem"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </DropdownMenuItem>

          {/* Admin Dashboard - Only shown to admin users */}
          {user?.role === "ADMIN" && (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          )}

          {/* Two-Factor Authentication Status/Toggle */}
          {user?.isTwoFactorEnabled ? (
            <DropdownMenuItem>
              <Lock className="h-4 w-4 mr-2 text-emerald-500" />
              2FA Enabled
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Key className="h-4 w-4 mr-2 text-destructive" />
              Enable 2FA
            </DropdownMenuItem>
          )}

          {/* Theme Toggle */}
          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            Toggle Theme
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout Button */}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={async () => await logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Modal */}
      <SettingsModal open={isModalOpen} onClose={handleModalClose} />
    </>
  );
};
