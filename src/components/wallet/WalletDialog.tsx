import * as React from "react"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface WalletDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WalletDialog({ className, ...props }: WalletDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="bg-black/90 backdrop-blur-lg border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        <div className={cn("grid gap-4", className)}>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-400 !via-pink-500 !to-red-500 !text-white !px-6 !py-3 !rounded-full !font-medium hover:!from-purple-500 hover:!via-pink-600 hover:!to-red-600 !transition-all !transform hover:!scale-105 !shadow-lg" />
        </div>
      </DialogContent>
    </Dialog>
  )
}