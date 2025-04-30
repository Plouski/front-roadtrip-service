"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { AlertMessage } from "@/components/ui/alert-message";

export default function PasswordRecoveryPage() {
  const router = useRouter();

  const [step, setStep] = useState<"request" | "reset">("request");
  const [method, setMethod] = useState<"email" | "sms">("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const showAlert = (msg: string, type: "success" | "error") => {
    setAlertMessage(msg);
    setAlertType(type);
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (method === "email") {
        await AuthService.initiatePasswordReset(email);
      } else {
        await AuthService.initiatePasswordResetBySMS(phone);
      }
      showAlert("Un code vous a été envoyé. Vérifiez vos messages.", "success");
      setStep("reset");
    } catch (error: any) {
      showAlert(error.message || "Erreur lors de la demande.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      showAlert("Tous les champs sont requis.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showAlert("Le mot de passe doit faire au moins 8 caractères.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(email, resetCode, newPassword);
      showAlert("Mot de passe réinitialisé avec succès.", "success");
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err: any) {
      showAlert(err.message || "Erreur lors de la réinitialisation.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>
              {step === "request" ? "Mot de passe oublié" : "Réinitialisation"}
            </CardTitle>
            <CardDescription>
              {step === "request"
                ? "Recevez un code par email ou SMS"
                : "Saisissez le code reçu et votre nouveau mot de passe"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={step === "request" ? handleRequest : handleReset}>
            <CardContent className="space-y-4">
              {step === "request" && (
                <>
                  <RadioGroup value={method} onValueChange={setMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="radio-email" />
                      <Label htmlFor="radio-email" className="flex items-center cursor-pointer">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="radio-sms" />
                      <Label htmlFor="radio-sms" className="flex items-center cursor-pointer">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        SMS
                      </Label>
                    </div>
                  </RadioGroup>

                  {method === "email" ? (
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <Label>Numéro de téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="+33612345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {step === "reset" && (
                <>
                  {method === "sms" && (
                    <div>
                      <Label>Email associé</Label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {method === "email" && (
                    <Input type="email" value={email} readOnly />
                  )}

                  <div>
                    <Label>Code de réinitialisation</Label>
                    <Input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Nouveau mot de passe</Label>
                    <Input
                      type="password"
                      placeholder="Minimum 8 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Confirmer le mot de passe</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {step === "request" ? "Envoyer" : "Réinitialiser"}
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
