import { useState } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, Send } from 'lucide-react';
import { submitMeetingRequest } from '../utils/api';
import { toast } from 'sonner';

interface MeetingRequestDialogProps {
    startupName: string;
    trigger?: React.ReactNode;
}

export function MeetingRequestDialog({ startupName, trigger }: MeetingRequestDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        note: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await submitMeetingRequest({
                startupName,
                ...formData
            });

            toast.success("تم تسجيل طلبك وسيتم التواصل معك في اقرب وقت");
            setOpen(false);
            // Reset form
            setFormData({ name: '', role: '', email: '', phone: '', note: '' });
        } catch (error) {
            console.error("Failed to submit request:", error);
            toast.error("Failed to send request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Book a Meeting</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request a Meeting</DialogTitle>
                    <DialogDescription>
                        Send a meeting request to the team at <span className="font-bold text-athar-black">{startupName}</span>.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Input
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">
                            Note / Agenda
                        </Label>
                        <Textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Briefly describe the purpose of the meeting..."
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-athar-blue hover:bg-athar-blue/90 text-white">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Request
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
