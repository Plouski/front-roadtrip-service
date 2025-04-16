"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Github, Twitter } from "lucide-react"
import { AuthService } from "@/services/auth-service"
import { AlertMessage } from "@/components/ui/alert-message"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null)

  // Vérifier si l'utilisateur est déjà connecté lors du chargement de la page
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await AuthService.checkAuthentication();
      if (isAuthenticated) {
        router.push('/');
      }
    };
    
    checkAuth();
  }, [router]);

  // Formulaire de connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await AuthService.login(email, password)
      setAlertMessage("Connexion réussie !")
      setAlertType("success")
      
      // Redirection après un court délai pour que l'utilisateur voie le message de succès
      setTimeout(() => {
        router.push("/")
      }, 500);
    } catch (error) {
      setAlertMessage(error.message || "Une erreur inconnue s'est produite. Veuillez réessayer.")
      setAlertType("error")
      setIsLoading(false)
    }
  }

  // Formulaire de l'inscription
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Vérification des mots de passe
    if (password !== passwordConfirm) {
      setAlertMessage("Les mots de passe ne correspondent pas.")
      setAlertType("error")
      return
    }

    setIsLoading(true)

    try {
      await AuthService.register(email, password, firstName, lastName)
      setAlertMessage("Inscription réussie ! Veuillez vérifier votre e-mail.")
      setAlertType("success")
      
      // Redirection vers la page de confirmation de compte après un court délai
      setTimeout(() => {
        router.push("/confirm-account")
      }, 1000);
    } catch (error) {
      setAlertMessage(error.message || "Veuillez essayer avec un autre e-mail.")
      setAlertType("error")
      setIsLoading(false)
    }
  }

  // Oauth
  const handleSocialLogin = async (provider: string) => {
    try {
      // Afficher une indication de chargement
      setIsLoading(true);
      setAlertMessage(`Redirection vers ${provider}...`);
      setAlertType("success");
      
      // Court délai pour afficher le message de chargement avant redirection
      setTimeout(() => {
        // Utilise la méthode socialLogin qui fait une redirection directe
        AuthService.socialLogin(provider);
        // Note: cette ligne qui suit ne sera jamais exécutée car la page sera rechargée
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setAlertMessage(`Impossible de se connecter avec ${provider}: ${error.message}`);
      setAlertType("error");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte RoadTrip! pour accéder à vos itinéraires favoris.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Se souvenir de moi
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                  {alertMessage && <AlertMessage message={alertMessage} type={alertType!} />}
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("facebook")}>
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("google")}>
                      {/* Icône pour Google */}
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("github")}>
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez RoadTrip! pour planifier vos aventures et découvrir des itinéraires uniques.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Mot de passe</Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                    <Input
                      id="password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      J'accepte les{" "}
                      <a href="#" className="text-primary hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="#" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Création en cours..." : "Créer un compte"}
                  </Button>
                  
                  {/* Ajout du composant AlertMessage dans le formulaire d'inscription */}
                  {alertMessage && <AlertMessage message={alertMessage} type={alertType!} />}

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou s'inscrire avec</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("facebook")}>
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("google")}>
                      {/* Icône pour Google */}
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin("github")}>
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}