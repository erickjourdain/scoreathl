<template>
  <div class="about">
    <span class="headline">Scoreathl</span><br>
    <span class="title">Protection des données</span><br>
    <span class="subheading">Généralités</span><br>
    <span class="body-2">
      L'utilisation de l'ensemble des fonctionnalités du site (inscription, envoi de message, etc.)
      sont uniquement disponibles aux utilisateurs enregistés. L'enregistrement peut s'effectuer via la fourniture d'un identifiant,
      d'un mot de passe et d'une adresse de messagerie électronique ou bien via un compte Facebook ou Google. Un avatar peut être fourni
      en complément des données obligatoires.<br>
      Seul l'identifiant et l'avatar s'il a été fourni sont visibles des autres utilisateurs. L'adresse email n'est utilisée qu'en cas de perte de mot de passe,
      pour envoyer un lien de réinitialisation de celui-ci.<br>
      En cas d'enregistrement via un compte Facebook ou Google les données suivantes sont récupérées et stockées dans la base de données du site:
      <ul>
        <li>id Facebook ou Google</li>
        <li>nom d'enregistrement Facebook ou Google</li>
        <li>adresse email</li>
        <li>avatar</li>
      </ul>
      Seul l'identifiant et l'avatar, s'il existe, sont visibles des autres utilisateurs.<br>
      <br>
      Ces informations sont nécessaires à l'administrateur pour assurer un confort d'utilisation via un système de login automatique,
      un accès aux différentes rubriques du site en fonction des profils (droits). Ces systèmes sont gérés via des cookies, l'acceptation de ceux-ci est donc
      nécessaire pour accèder à l'ensemble des fonctionnalités du site.
    </span><br>
    <br>
    <span class="subheading">Compétitions</span><br>
    <span class="body-2">
      L'inscription a une compétition peut être effectuée par un utilisateur enregistré, à condition qu'il ait à sa disposition le mot de passe de la compétition,
      ou par un organisateur. Pour chaque équipe les informations suivantes sont requises et enregistrées dans la base de données:
      <ul>
        <li>nom de l'équipe</li>
        <li>pour chaque membre</li>
        <ul>
          <li>prénom</li>
          <li>nom</li>
          <li>année de naissance</li>
        </ul>
      </ul>
      En complément il peut être fourni un avatar pour l'équipe et chaque membre de celle-ci.<br>
      <br>
      Ces informations sont nécessaires aux organisateurs pour gérer leur compétition. L'année de naissance est utilisée pour déterminer la catégorie de l'athlète,
      elle n'est visible que par la personne ayant inscrit l'équipe, les organisateurs de la compétition et les administrateurs du site.
    </span>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>
