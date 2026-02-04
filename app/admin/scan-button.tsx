'use client'

import { scanPhotos } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ScanButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleScan = async () => {
    setLoading(true);
    const result = await scanPhotos();
    setLoading(false);
    setMessage(result.message || (result.success ? "Success" : "Failed"));
  };
  

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan Photos folder"}
      </Button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
 
}
