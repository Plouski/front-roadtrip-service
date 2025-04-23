"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertMessage } from "@/components/ui/alert-message";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { AuthService } from "@/services/auth-service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [emailValue, setEmail] = useState(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (newPassword !== confirmPassword) {
      setAlertMessage("Les mots de passe ne correspondent pas.");
      setAlertType("error");
      return;
    }

    // Vérification de la complexité du mot de passe
    if (newPassword.length < 8) {
      setAlertMessage("Le mot de passe doit contenir au moins 8 caractères.");
      setAlertType("error");
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.resetPassword(emailValue, resetCode, newPassword);
      setAlertMessage("Votre mot de passe a été réinitialisé avec succès.");
      setAlertType("success");

      // Redirection vers la page de connexion après quelques secondes
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.message || "Erreur lors de la réinitialisation du mot de passe.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 mr-2"
                onClick={() => router.push("/forgot-password")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Réinitialisation du mot de passe</CardTitle>
            </div>
            <CardDescription>
              Entrez le code reçu et votre nouveau mot de passe
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!searchParams.get("email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-code">Code de réinitialisation</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="Entrez le code reçu"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réinitialisation en cours...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Réinitialiser le mot de passe
                  </>
                )}
              </Button>

              {alertMessage && <AlertMessage message={alertMessage} type={alertType!} />}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}