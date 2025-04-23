// export function formatAiResponse(response: any): string {
//     if (!response || typeof response !== "object") return "Je n’ai pas pu générer une réponse valide.";
  
//     if (response.type === "roadtrip_itinerary") {
//       const lines: string[] = [];
  
//       lines.push(`✨ Voici un itinéraire recommandé pour un roadtrip de ${response.duree_recommandee} en ${response.destination} !\n`);
  
//       if (response.saison_ideale) {
//         lines.push(`🗓️ Saison idéale : ${response.saison_ideale}\n`);
//       }
  
//       if (response.budget_estime) {
//         lines.push(`💶 Budget estimé : ${response.budget_estime.montant}`);
//         const d = response.budget_estime.details || {};
//         if (d.hebergement || d.nourriture || d.carburant || d.activites) {
//           lines.push(`  • Hébergement : ${d.hebergement}`);
//           lines.push(`  • Nourriture : ${d.nourriture}`);
//           lines.push(`  • Carburant : ${d.carburant}`);
//           lines.push(`  • Activités : ${d.activites}`);
//         }
//         lines.push(""); // saut de ligne
//       }
  
//       if (response.itineraire?.length) {
//         lines.push(`📍 Itinéraire jour par jour :\n`);
//         response.itineraire.forEach((jour: any) => {
//           lines.push(`📅 Jour ${jour.jour}`);
//           lines.push(`  ➤ Trajet : ${jour.trajet}`);
//           if (jour.temps_conduite) lines.push(`  🚗 Temps de conduite estimé : ${jour.temps_conduite}`);
//           if (jour.etapes_recommandees?.length) {
//             lines.push(`  🔸 Étapes recommandées :`);
//             jour.etapes_recommandees.forEach((etape: string) => lines.push(`    - ${etape}`));
//           }
//           if (jour.activites?.length) {
//             lines.push(`  🎯 Activités proposées :`);
//             jour.activites.forEach((a: string) => lines.push(`    - ${a}`));
//           }
//           if (jour.hebergement) {
//             lines.push(`  🛏️ Hébergement suggéré : ${jour.hebergement}`);
//           }
//           lines.push(""); // saut de ligne entre les jours
//         });
//       }
  
//       if (response.conseils_route?.length) {
//         lines.push(`🚘 Conseils de conduite :`);
//         response.conseils_route.forEach((c: string) => lines.push(`  • ${c}`));
//         lines.push("");
//       }
  
//       if (response.equipement_essentiel?.length) {
//         lines.push(`🎒 Équipements essentiels à emporter :`);
//         response.equipement_essentiel.forEach((e: string) => lines.push(`  • ${e}`));
//         lines.push("");
//       }
  
//       if (response.apps_recommandees?.length) {
//         lines.push(`📱 Applications utiles pour le voyage :`);
//         response.apps_recommandees.forEach((app: any) => {
//           lines.push(`  • ${app.nom} : ${app.description}`);
//         });
//         lines.push("");
//       }
  
//       return lines.join("\n");
//     }
  
//     if (response.type === "roadtrip_advice") {
//       const lines: string[] = [];
  
//       lines.push(`🧭 Conseils personnalisés : ${response.sujet}\n`);
//       lines.push(response.reponse);
//       lines.push("");
  
//       if (response.recommandations?.length) {
//         lines.push(`✅ Recommandations :`);
//         response.recommandations.forEach((r: string) => lines.push(`  • ${r}`));
//         lines.push("");
//       }
  
//       if (response.ressources_utiles?.length) {
//         lines.push(`🔗 Ressources utiles :`);
//         response.ressources_utiles.forEach((r: string) => lines.push(`  • ${r}`));
//         lines.push("");
//       }
  
//       return lines.join("\n");
//     }
  
//     return "Je n’ai pas compris le type de demande. Pouvez-vous reformuler ?";
//   }
  
export function formatAiResponse(response: any): string {
  if (!response || typeof response !== "object") return "Réponse invalide.";

  let message = "";

  // === Type : Itinéraire ===
  if (response.type === "roadtrip_itinerary") {
    message += `✨ Voici un itinéraire recommandé pour un roadtrip de ${response.duree_recommandee || "X jours"} en ${response.destination || "destination inconnue"} !\n\n`;
    message += `🗓️ Saison idéale : ${response.saison_ideale || "non précisée"}\n`;
    message += `💶 Budget estimé : ${response.budget_estime?.montant || "inconnu"}\n`;

    if (response.budget_estime?.details) {
      for (const [key, value] of Object.entries(response.budget_estime.details)) {
        message += ` • ${key} : ${value}\n`;
      }
    }

    if (response.itineraire?.length) {
      message += `\n📍 Itinéraire jour par jour :\n`;
      for (const step of response.itineraire) {
        message += `\n📅 Jour ${step.jour} ➤ Trajet : ${step.trajet}\n`;
        if (step.temps_conduite) {
          message += `🚗 Temps de conduite estimé : ${step.temps_conduite}\n`;
        }
        if (step.etapes_recommandees?.length) {
          message += `🔸 Étapes recommandées :\n${step.etapes_recommandees.map((e) => `  - ${e}`).join("\n")}\n`;
        }
        if (step.activites?.length) {
          message += `🎯 Activités proposées :\n${step.activites.map((a) => `  - ${a}`).join("\n")}\n`;
        }
        if (step.hebergement) {
          message += `🛏️ Hébergement suggéré : ${step.hebergement}\n`;
        }
      }
    }

    if (response.conseils_route?.length) {
      message += `\n🚘 Conseils de conduite :\n${response.conseils_route.map((c) => ` • ${c}`).join("\n")}\n`;
    }

    if (response.equipement_essentiel?.length) {
      message += `\n🎒 Équipements essentiels à emporter :\n${response.equipement_essentiel.map((e) => ` • ${e}`).join("\n")}\n`;
    }

    if (response.apps_recommandees?.length) {
      message += `\n📱 Applications utiles pour le voyage :\n`;
      response.apps_recommandees.forEach((app: any) => {
        message += ` • ${app.nom} : ${app.description}\n`;
      });
    }

    return message;
  }

  // === Type : Conseil général ===
  if (response.type === "roadtrip_advice") {
    message += `🧭 Conseils personnalisés : ${response.sujet || "Sujet inconnu"}\n\n`;
    message += `${response.reponse || "Je n'ai pas pu formuler de réponse complète."}\n\n`;

    if (Array.isArray(response.recommandations)) {
      message += `✅ Recommandations :\n`;
      for (const rec of response.recommandations) {
        if (typeof rec === "object" && rec.destination) {
          message += ` • ${rec.destination}\n`;
          if (rec.activites?.length) {
            rec.activites.forEach((act: string) => {
              message += `    - ${act}\n`;
            });
          }
          if (rec.hebergement) {
            message += `   🛏️ Hébergement : ${rec.hebergement}\n`;
          }
        } else if (typeof rec === "object" && rec.titre) {
          message += ` • ${rec.titre}${rec.description ? ` — ${rec.description}` : ""}\n`;
        } else if (typeof rec === "string") {
          message += ` • ${rec}\n`;
        } else {
          message += ` • ${JSON.stringify(rec)}\n`;
        }
      }
    }    

    if (Array.isArray(response.ressources_utiles) && response.ressources_utiles.length) {
      message += `\n🔗 Ressources utiles :\n`;
      message += response.ressources_utiles.map((r) => ` • ${r}`).join("\n");
    }

    return message;
  }

  return JSON.stringify(response, null, 2);
}
