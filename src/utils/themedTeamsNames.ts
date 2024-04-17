const themedTeamsNames: Record<string, string[]> = {
  Couleurs: [
    "Rouge",
    "Vert",
    "Bleu",
    "Jaune",
    "Violet",
    "Orange",
    "Indigo",
    "Gris",
    "Noir",
    "Blanc",
    "Bordeaux",
    "Turquoise",
    "Magenta",
    "Saumon",
    "Amande",
    "Crème",
    "Doré",
    "Argenté",
    "Bronze",
    "Corail",
    "Saphir",
    "Opale",
    "Topaze",
    "Olive",
    "Menthe",
    "Lavande",
    "Marron",
    "Beige",
    "Cyan",
    "Fuchsia",
  ],
  Légumes: [
    "Carotte",
    "Tomate",
    "Courgette",
    "Aubergine",
    "Poivron",
    "Brocoli",
    "Chou-fleur",
    "Asperge",
    "Épinard",
    "Salade",
    "Pomme de terre",
    "Oignon",
    "Haricot vert",
    "Petit pois",
    "Radis",
    "Concombre",
    "Champignon",
    "Navet",
    "Céleri",
    "Artichaut",
    "Blette",
    "Fenouil",
    "Gombo",
    "Panais",
    "Patate douce",
    "Poireau",
    "Rutabaga",
    "Topinambour",
    "Betterave",
    "Chou kale",
  ],
  Fruits: [
    "Pomme",
    "Banane",
    "Orange",
    "Poire",
    "Raisin",
    "Mangue",
    "Fraise",
    "Cerise",
    "Ananas",
    "Melon",
    "Pastèque",
    "Kiwi",
    "Pêche",
    "Nectarine",
    "Abricot",
    "Prune",
    "Framboise",
    "Myrtille",
    "Citron",
    "Lime",
    "Mandarine",
    "Pamplemousse",
    "Figue",
    "Papaye",
    "Avocat",
    "Kaki",
    "Litchi",
    "Durian",
    "Grenade",
    "Coing",
  ],
  Pâtisseries: [
    "Croissant",
    "Éclair au chocolat",
    "Tarte aux pommes",
    "Macaron",
    "Mille-feuille",
    "Opéra",
    "Paris-Brest",
    "Profiterole",
    "Madeleine",
    "Financier",
    "Cannelé",
    "Tarte tatin",
    "Clafoutis",
    "Pain au chocolat",
    "Brioche",
    "Sablé",
    "Éclair au café",
    "Tarte au citron",
    "Fondant au chocolat",
    "Tarte aux fraises",
    "Palmier",
    "Gauffre",
    "Beignet",
    "Baba au rhum",
    "Kouign-amann",
    "Chouquette",
    "Tarte normande",
    "Saint-Honoré",
    "Charlotte aux fraises",
    "Quatre-quarts",
  ],
  Planètes: [
    "Mercure",
    "Vénus",
    "Terre",
    "Mars",
    "Jupiter",
    "Saturne",
    "Uranus",
    "Neptune",
    "Pluton",
    "Eris",
    "Haumea",
    "Makemake",
    "Cérès",
    "Sedna",
    "Orcus",
    "Quaoar",
    "Varuna",
    "Ixion",
    "Varda",
    "Chaos",
    "Gonggong",
    "Salacia",
    "Logos",
    "Pallas",
    "Hygiea",
    "Vesta",
    "Chariklo",
    "Huya",
    "Echeclus",
    "Teharonhiawako",
  ],
  Pays: [
    "Nouvelle-Zélande",
    "États-Unis",
    "Canada",
    "Brésil",
    "Chine",
    "Inde",
    "Russie",
    "Australie",
    "Allemagne",
    "Italie",
    "Espagne",
    "Mexique",
    "Japon",
    "Corée du Sud",
    "Argentine",
    "Chili",
    "Afrique du Sud",
    "Nigéria",
    "Égypte",
    "Turquie",
    "Iran",
    "Indonésie",
    "Thaïlande",
    "Suède",
    "Norvège",
    "Finlande",
    "Danemark",
    "Pologne",
    "Belgique",
    "Pays-Bas",
  ],
  Pierres_Précieuses: [
    "Diamant",
    "Rubis",
    "Saphir",
    "Émeraude",
    "Améthyste",
    "Tanzanite",
    "Aigue-marine",
    "Opale",
    "Topaze",
    "Turquoise",
    "Pierre de lune",
    "Onyx",
    "Perle",
    "Péridot",
    "Quartz",
    "Quartz rose",
    "Citrine",
    "Jade",
    "Jaspe",
    "Lapis-lazuli",
    "Malachite",
    "Morganite",
    "Obsidienne",
    "Grenat",
    "Zircon",
    "Chrysocolle",
    "Alexandrite",
    "Hématite",
    "Agate",
    "Tourmaline",
  ],
  Disney: [
    "Mickey",
    "Minnie",
    "Donald",
    "Daisy",
    "Pluto",
    "Ratatouille",
    "Simba",
    "Mufasa",
    "Nala",
    "Scar",
    "Jafar",
    "Aladdin",
    "Jasmine",
    "Ariel",
    "Belle",
    "Cendrillon",
    "Blanche-Neige",
    "Buzz l'éclair",
    "Peter Pan",
    "Maléfique",
    "Capitaine crochet",
    "La Bête",
    "Elsa",
    "Anna",
    "Olaf",
    "Picsou",
    "Woody",
    "Quasimodo",
    "Pocahontas",
    "Mulan",
  ],
  Films: [
    "Les Évadés",
    "Le Parrain",
    "La soupe aux choux",
    "Cube",
    "Les Douze Hommes en colère",
    "La Liste de Schindler",
    "Pulp Fiction",
    "Le Bon, la Brute et le Truand",
    "Le Seigneur des anneaux",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "Sixième sens",
    "Independance day",
    "Mandalorian",
    "Matrix",
    "Les Affranchis",
    "Les Sept Samouraïs",
    "La Vie est belle",
    "City of God",
    "Se7en",
    "Le Silence des agneaux",
    "Intouchables",
    "Star wars",
    "Harakiri",
    "Parasite",
    "Scarface",
    "Le Pianiste",
    "Beatle juice",
    "Interstellar",
  ],
  Super_Héros: [
    "Batman",
    "Superman",
    "Spider-Man",
    "Iron Man",
    "Wolverine",
    "Cyclope",
    "Tornade",
    "Jean Grey",
    "Thor",
    "Hulk",
    "Capitaine America",
    "Black widow",
    "Docteur Strange",
    "Daredevil",
    "Flash",
    "Green lantern",
    "Aquaman",
    "Wonder Woman",
    "Panthère Noire",
    "Ant-Man",
    "Surfeur d'Argent",
    "Vision",
    "Sorcière Rouge",
    "Œil-de-Faucon",
    "Supergirl",
    "Catwoman",
    "Nightwing",
    "Arrow",
    "Shazam",
    "Loki"
  ],
  BD: [
    "Tintin",
    "Capitaine Haddock",
    "Milou",
    "Astérix",
    "Obélix",
    "Idéfix",
    "Lucky Luke",
    "Les Dalton",
    "Spirou",
    "Fantasio",
    "Gaston Lagaffe",
    "Marsupilami",
    "Schtroumpfette",
    "Gargamel",
    "Rantanplan",
    "Largo Winch",
    "Thorgal",
    "Blueberry",
    "Achille Talon",
    "Boule & Bill",
    "Peppa pig",
    "Barbe Rouge",
    "Alix",
    "Cédric",
    "Valérian",
    "Yakari",
    "Léonard",
    "Gai-Luron",
    "Tchoupi",
    "Titeuf",
  ],
};

export default themedTeamsNames;