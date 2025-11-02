export const useErrorParser = (response: { status: number })=>{
    if (response.status === 403) {
        return "Accès refusé";
    }
    if (response.status === 401) {
        return "Non autorisé";
    }
    if (response.status === 404) {
        return "Ressource non trouvée";
    }
    if (response.status === 500) {
        return "Erreur interne du serveur";
    }
    if(response.status === 409){
        return "Cette ressource existe déjà";
    }
}