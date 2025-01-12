// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { SettingsForm } from "./settings-form";

// interface SettingsModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent
//         className="sm:max-w-[600px]"
//         onOpenAutoFocus={(e) => e.preventDefault()}
//         onCloseAutoFocus={(e) => e.preventDefault()}
//       >
//         <DialogHeader>
//           <DialogTitle>Settings</DialogTitle>
//           <DialogDescription>
//             Update your profile and preferences
//           </DialogDescription>
//         </DialogHeader>
//         <SettingsForm modal onSuccess={onClose} />
//       </DialogContent>
//     </Dialog>
//   );
// };
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsForm } from "./settings-form";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ open, onClose }: SettingsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px]"
        onEscapeKeyDown={onClose}
        onInteractOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Update your profile and preferences
          </DialogDescription>
        </DialogHeader>
        <SettingsForm modal onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};
