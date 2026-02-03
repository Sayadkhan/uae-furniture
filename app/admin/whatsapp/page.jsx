"use client";

import { useEffect, useState } from "react";
import { addWhatsappNumber } from "./actions/actions";
import { getWhatsappNumber } from "./actions/getWhatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Phone } from "lucide-react";
import { toast } from "react-toastify";  // ✅ Import toast

export default function WhatsAppSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [existingNumber, setExistingNumber] = useState("");

  useEffect(() => {
    async function fetchNumber() {
      const num = await getWhatsappNumber();
      setExistingNumber(num);
    }
    fetchNumber();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const res = await addWhatsappNumber(formData);

    setLoading(false);

    if (res.success) {
      toast.success("WhatsApp number updated successfully!");
      const num = await getWhatsappNumber();
      setExistingNumber(num);
      e.target.reset();
    } else {
      toast.error("❌ Failed to update number!"); 
    }
  }

  return (
    <div className="flex flex-col w-full px-6 py-10">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Phone className="w-5 h-5 text-green-500" /> WhatsApp Number
          </CardTitle>
          <CardDescription>
            This number will be used for WhatsApp chat integration on the website.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              name="whatsapp"
              defaultValue={existingNumber}
              placeholder="+8801XXXXXXXXX"
              className="h-11 text-base"
              required
            />

            <Button type="submit" className="h-11 text-base" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Save Number
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
