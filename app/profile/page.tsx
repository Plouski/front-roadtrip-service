"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertMessage } from "@/components/ui/alert-message";
import { AuthService } from "@/services/auth-service";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, User, Shield, Key, UserX } from "lucide-react";
import { SubscriptionService } from "@/services/subscription-service";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Formulaire de profil
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // Formulaire de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Messages d'alerte
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const token = AuthService.getAuthToken();
        if (!token) {
          router.push("/auth");
          return;
        }

        const userData = await AuthService.getProfile();
        const currentSub = await SubscriptionService.getCurrentSubscription();

        setUser(userData);
        setSubscription(currentSub);

        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setAlertMessage(
          "Impossible de charger votre profil. Veuillez vous reconnecter."
        );
        setAlertType("error");
        setTimeout(() => {
          AuthService.logout();
          router.push("/auth");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Gère les changements dans le formulaire de profil
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gère les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enregistre les modifications du profil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertMessage("");

    try {
      const updatedUser = await AuthService.updateProfile(formData);
      setUser(updatedUser);
      setAlertMessage("Profil mis à jour avec succès");
      setAlertType("success");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setAlertMessage(
        error.message || "Erreur lors de la mise à jour du profil"
      );
      setAlertType("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Change le mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Vérification que les mots de passe correspondent
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertMessage("Les mots de passe ne correspondent pas");
      setAlertType("error");
      return;
    }

    setIsChangingPassword(true);
    setAlertMessage("");

    try {
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setAlertMessage("Mot de passe modifié avec succès");
      setAlertType("success");
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setAlertMessage(
        error.message || "Erreur lors du changement de mot de passe"
      );
      setAlertType("error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Supprime le compte
  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await AuthService.deleteAccount();

      // Message de confirmation et déconnexion
      setAlertMessage("Votre compte a été supprimé");
      setAlertType("success");

      // Déconnexion et redirection après un délai
      setTimeout(() => {
        AuthService.logout();
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      setAlertMessage(
        error.message || "Erreur lors de la suppression du compte"
      );
      setAlertType("error");
      setIsDeleting(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await SubscriptionService.cancelSubscription();
      setAlertMessage("Votre abonnement a été annulé.");
      setAlertType("success");
      setUser({ ...user, role: "user" });

      // ⬇️ Revenir à l'onglet "profile"
      setActiveTab("profile");
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      setAlertMessage("Une erreur est survenue lors de l'annulation.");
      setAlertType("error");
    }
  };

  // Affiche un écran de chargement
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">
            Chargement de votre profil...
          </h2>
        </div>
      </div>
    );
  }

  const isOAuthUser = user?.authProvider && user.authProvider !== "local";

  // Première lettre de chaque nom pour l'avatar
  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || "?";
    const last = formData.lastName?.charAt(0) || "?";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {alertMessage && (
        <div className="mb-6">
          <AlertMessage message={alertMessage} type={alertType} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
        {/* Sidebar avec avatar et informations de base */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.avatar}
                    alt={`${formData.firstName} ${formData.lastName}`}
                  />
                  <AvatarFallback className="text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formData.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Membre depuis</dt>
                  <dd>{new Date(user?.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Rôle</dt>
                  <dd className="flex items-center">
                    <Shield className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    {user?.role || "Utilisateur"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Bouton de suppression de compte */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <UserX className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement
                  votre compte et toutes vos données personnelles de nos
                  serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  {isDeleting ? "Suppression..." : "Supprimer définitivement"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Sections principales */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Informations personnelles
              </TabsTrigger>
              {!isOAuthUser && (
                <TabsTrigger value="password" className="flex items-center">
                  <Key className="mr-2 h-4 w-4" />
                  Changer de mot de passe
                </TabsTrigger>
              )}
              {user?.role === "premium" && (
                <TabsTrigger value="subscription" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Mon abonnement
                </TabsTrigger>
              )}
            </TabsList>

            {/* Onglet informations personnelles */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles ici. Ces
                    informations seront affichées publiquement, alors faites
                    attention à ce que vous partagez.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        L'email ne peut pas être modifié. Contactez le support
                        pour changer d'adresse email.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Téléphone (optionnel)</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving
                        ? "Enregistrement..."
                        : "Enregistrer les modifications"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Onglet changement de mot de passe */}
            {!isOAuthUser && (
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Changer de mot de passe</CardTitle>
                    <CardDescription>
                      Assurez-vous que votre nouveau mot de passe est
                      suffisamment fort et différent des précédents.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleChangePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Mot de passe actuel
                        </Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          Nouveau mot de passe
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum 8 caractères, incluant au moins une lettre
                          majuscule, une lettre minuscule et un chiffre.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmer le mot de passe
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword
                          ? "Modification..."
                          : "Changer le mot de passe"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Mon abonnement Premium</CardTitle>
                  <CardDescription>
                    Gérez votre abonnement, accédez aux options de mise à niveau
                    ou annulez votre abonnement à tout moment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Type de plan :{" "}
                    <strong>{subscription?.plan || "N/A"}</strong>
                  </p>
                  <p>
                    Status :{" "}
                    <strong
                      className={
                        subscription?.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {subscription?.status || "Inconnu"}
                    </strong>
                  </p>
                  <p>
                    Début :{" "}
                    <strong>
                      {subscription?.startDate
                        ? new Date(subscription.startDate).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </p>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/premium")}
                  >
                    Changer de plan
                  </Button>
                  <Button onClick={handleCancelSubscription}>
                    Annuler mon abonnement
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
