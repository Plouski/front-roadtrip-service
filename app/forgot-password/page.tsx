"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertMessage } from "@/components/ui/alert-message";
import { ArrowLeft, Mail, MessageSquare, Loader2, Lock } from "lucide-react";
import { AuthService } from "@/services/auth-service";

export default function PasswordRecoveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [tab, setTab] = useState("forgot");
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [canAccessReset, setCanAccessReset] = useState(false);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (method === "email") {
        await AuthService.initiatePasswordReset(email);
        setAlertMessage("Si cette adresse email est associée à un compte, un lien de réinitialisation a été envoyé.");
        setAlertType("success");
      } else {
        // Pour l'envoi par SMS
        await AuthService.initiatePasswordResetBySMS(phone);
        setAlertMessage("Si ce numéro est associé à un compte, un code de réinitialisation a été envoyé par SMS.");
        setAlertType("success");
  
        // Activer l'onglet de réinitialisation au lieu de rediriger
        setCanAccessReset(true);
        setTimeout(() => {
          setTab("reset");
        }, 1500); // Délai court pour que l'utilisateur voie le message de succès
      }
  
      // Réinitialiser les champs après succès
      setEmail("");
      setPhone("");
    } catch (error) {
      // Même en cas d'erreur, ne pas révéler si l'email/téléphone existe ou non
      setAlertMessage("Nous avons rencontré un problème. Veuillez réessayer plus tard.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      showAlert("Les mots de passe ne correspondent pas.", "error");
      return;
    }
  
    if (newPassword.length < 8) {
      showAlert("Le mot de passe doit contenir au moins 8 caractères.", "error");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Utilisez l'email ou le téléphone selon la méthode utilisée
      const identifier = method === "email" ? email : phone;
      
      await AuthService.resetPassword(identifier, resetCode, newPassword);
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
        <Tabs defaultValue="forgot" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="forgot">Mot de passe oublié</TabsTrigger>
            <TabsTrigger value="reset" disabled={!canAccessReset} className={!canAccessReset ? "cursor-not-allowed opacity-50" : ""}>
              Réinitialisation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forgot">
            <Card>
              <CardHeader>
                <CardTitle>Récupération</CardTitle>
                <CardDescription>Choisissez une méthode pour recevoir un lien ou un code.</CardDescription>
              </CardHeader>
              <form onSubmit={handleForgotSubmit}>
                <CardContent className="space-y-4">
                  <RadioGroup value={method} onValueChange={setMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-option" />
                      <Label htmlFor="email-option" className="flex items-center cursor-pointer">
                        <Mail className="mr-2 h-4 w-4" /> Par email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms-option" />
                      <Label htmlFor="sms-option" className="flex items-center cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" /> Par SMS
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
                      <Label>Téléphone</Label>
                      <Input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format : +33612345678 ou 0612345678
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Envoyer les instructions
                  </Button>
                  {alertMessage && <AlertMessage message={alertMessage} type={alertType!} />}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Réinitialisation</CardTitle>
                <CardDescription>Entrez le code reçu et définissez un nouveau mot de passe.</CardDescription>
              </CardHeader>
              <form onSubmit={handleResetSubmit}>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!searchParams.get("email")}
                    />
                  </div>
                  <div>
                    <Label>Code de réinitialisation</Label>
                    <Input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Code reçu"
                      required
                    />
                  </div>
                  <div>
                    <Label>Nouveau mot de passe</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      required
                    />
                  </div>
                  <div>
                    <Label>Confirmation</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmez le mot de passe"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Réinitialisation...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Réinitialiser
                      </>
                    )}
                  </Button>
                  {alertMessage && <AlertMessage message={alertMessage} type={alertType!} />}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
