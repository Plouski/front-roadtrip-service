"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertMessage } from "@/components/ui/alert-message";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ConfirmAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage("Lien invalide ou expiré.");
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/verify-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setMessage("Votre compte a bien été vérifié. Vous pouvez maintenant vous connecter !");
        setStatus("success");
      } catch (err: any) {
        setMessage(err.message || "Une erreur est survenue.");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Confirmation de compte</h1>

      {loading ? (
        <div className="flex flex-col items-center space-y-4 animate-pulse text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Vérification du lien en cours...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 max-w-md">
          {status === "success" && <CheckCircle className="text-green-600 w-12 h-12" />}
          {status === "error" && <XCircle className="text-red-600 w-12 h-12" />}

          <AlertMessage type={status!} message={message} />

          {status === "success" && (
            <Button className="mt-4" onClick={() => router.push("/auth")}>
              Se connecter
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
