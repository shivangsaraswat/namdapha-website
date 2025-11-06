"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<{valid: boolean; name?: string; course?: string; issueDate?: string; certificateId?: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!certificateId.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      setVerificationResult({
        valid: true,
        name: "John Doe",
        course: "Web Development Bootcamp",
        issueDate: "January 15, 2025",
        certificateId: certificateId
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="container relative mx-auto h-full max-w-[1200px]">
          <Image src="/bg.svg" alt="Background pattern left" width={358} height={1702} className="absolute -top-7 left-[-304px] opacity-10 lg:hidden" priority />
          <Image src="/bg.svg" alt="Background pattern right" width={358} height={1702} className="absolute bottom-0 right-[-320px] opacity-10 lg:hidden" priority />
          <Image src="/bg.svg" alt="Background pattern desktop" width={672} height={326} className="absolute right-0 top-0 opacity-10 hidden lg:block md:-right-8 md:-top-1.5 sm:top-2" priority />
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/bg.svg" alt="Hero background" fill className="object-cover" priority />
        </div>
        
        <div className="relative z-10 py-12 px-6 md:px-8 lg:px-12 pt-28">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] font-medium leading-[1.05] tracking-tight">
              <span className="bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Verify </span>
              <span className="text-[#7C3AED]">Certificates</span>
              <br />
              <span className="bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Instantly & Securely</span>
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Verify and download certificates issued under Namdapha House. Enter certificate ID to validate<br className="hidden md:block" /> authenticity and access verified digital copies instantly.
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[800px] mx-auto">
          <Card className="p-8 md:p-10 shadow-lg bg-white rounded-2xl">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-900">Certificate ID</Label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Enter certificate ID (e.g., NH2024001)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-4 py-3"
                />
                <Button 
                  onClick={handleVerify}
                  disabled={loading || !certificateId.trim()}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 rounded-lg font-medium"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
              <div className="flex items-center justify-end gap-2 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">Secure verification</span>
              </div>
            </div>

            {verificationResult && (
              <div className={`mt-6 p-6 rounded-lg border-2 ${
                verificationResult.valid 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start gap-4">
                  {verificationResult.valid ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${
                      verificationResult.valid ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {verificationResult.valid ? 'Certificate Verified ✓' : 'Certificate Not Found'}
                    </h3>
                    {verificationResult.valid ? (
                      <div className="space-y-2 text-sm text-green-800">
                        <p><span className="font-semibold">Recipient:</span> {verificationResult.name}</p>
                        <p><span className="font-semibold">Course:</span> {verificationResult.course}</p>
                        <p><span className="font-semibold">Issue Date:</span> {verificationResult.issueDate}</p>
                        <p><span className="font-semibold">Certificate ID:</span> {verificationResult.certificateId}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-800">
                        The certificate ID you entered could not be found in our records. Please check the ID and try again.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
