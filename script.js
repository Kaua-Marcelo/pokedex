const pokemons = [
    {
     id: 1,
     name: "Charmander",
     type: ["Fire"],
     category: ["Lizard"],
     weight: 8.5,
     height: 0.6,
     weakness: ["Water", "Rock", "Ground"],
     about: "The flame at the tip of its tail indicates its life force; when it shines intensely, it means it is healthy; if it weakens, its condition is worrying. Although naturally docile, it can become ferocious in battles, unleashing powerful flames against its opponents.",
     image: "./assets/Charmander.png",
     evolutions: [
      {
       id: 10,
       name: "Charmeleon",
       type: ["Fire"],
       category: ["Flame"],
       weight: 19.0,
       height: 1.1,
       weakness: ["Water", "Rock", "Ground"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Charmeleon.png"
      },
      {
       id: 11,
       name: "Charizard",
       type: ["Fire", "Flying"],
       category: ["Flame"],
       weight: 90.5,
       height: 1.7,
       weakness: ["Water", "Electric", "Rock"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Charizard.png"
      }
     ]
    },
    {
     id: 2,
     name: "Squirtle",
     type: ["Water"],
     category: ["Tiny Turtle"],
     weight: 9.0,
     height: 0.5,
     weakness: ["Electric", "Grass"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", // As demais descrições serão adicionadas posteriormente
     image: "./assets/Squirtle.png",
     evolutions: [
      {
       id: 12,
       name: "Wartortle",
       type: ["Water"],
       category: ["Turtle"],
       weight: 22.5,
       height: 1.0,
       weakness: ["Electric", "Grass"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Wartortle.png"
      },
      {
       id: 13,
       name: "Blastoise",
       type: ["Water"],
       category: ["Shellfish"],
       weight: 85.5,
       height: 1.6,
       weakness: ["Electric", "Grass"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Blastoise.png"
      }
     ]
    },
    {
     id: 3,
     name: "Mewtwo",
     type: ["Psychic"],
     category: ["Genetic"],
     weight: 122.0,
     height: 2.0,
     weakness: ["Bug", "Ghost", "Dark"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Mewtwo.png",
     evolutions: []
    },
    {
     id: 4,
     name: "Snorlax",
     type: ["Normal"],
     category: ["Sleeping"],
     weight: 460.0,
     height: 2.1,
     weakness: ["Fighting"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Snorlax.png",
     evolutions: []
    },
    {
     id: 5,
     name: "Pikachu",
     type: ["Electric"],
     category: ["Mouse"],
     weight: 6.0,
     height: 0.4,
     weakness: ["Ground"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Pikachu.png",
     evolutions: [
      {
       id: 14,
       name: "Raichu",
       type: ["Electric"],
       category: ["Mouse"],
       weight: 30.0,
       height: 0.8,
       weakness: ["Ground"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Raichu.png"
      }
     ]
    },
    {
     id: 6,
     name: "Jolteon",
     type: ["Electric"],
     category: ["Lightning"],
     weight: 24.5,
     height: 0.8,
     weakness: ["Ground"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Jolteon.png",
     evolutions: []
    },
    {
     id: 7,
     name: "Growlithe",
     type: ["Fire"],
     category: ["Puppy"],
     weight: 19.0,
     height: 0.7,
     weakness: ["Water", "Rock", "Ground"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Growlithe.png",
     evolutions: [
      {
       id: 15,
       name: "Arcanine",
       type: ["Fire"],
       category: ["Legendary"],
       weight: 155.0,
       height: 1.9,
       weakness: ["Water", "Rock", "Ground"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Arcanine.png"
      }
     ]
    },
    {
     id: 8,
     name: "Nidorina",
     type: ["Poison"],
     category: ["Poison Pin"],
     weight: 20.0,
     height: 0.8,
     weakness: ["Ground", "Psychic"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Nidorina.png",
     evolutions: [
      {
       id: 16,
       name: "Nidoqueen",
       type: ["Poison", "Ground"],
       category: ["Drill"],
       weight: 60.0,
       height: 1.3,
       weakness: ["Water", "Ice", "Psychic", "Ground"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Nidoqueen.png"
      }
     ]
    },
    {
     id: 9,
     name: "Bulbasaur",
     type: ["Grass", "Poison"],
     category: ["Seed"],
     weight: 6.9,
     height: 0.7,
     weakness: ["Fire", "Ice", "Flying", "Psychic"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Bulbasaur.png",
     evolutions: [
      {
       id: 17,
       name: "Ivysaur",
       type: ["Grass", "Poison"],
       category: ["Seed"],
       weight: 13.0,
       height: 1.0,
       weakness: ["Fire", "Ice", "Flying", "Psychic"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Ivysaur.png"
      },
      {
       id: 18,
       name: "Venusaur",
       type: ["Grass", "Poison"],
       category: ["Seed"],
       weight: 100.0,
       height: 2.0,
       weakness: ["Fire", "Ice", "Flying", "Psychic"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Venusaur.png"
      }
     ]
    },
    {
     id: 10,
     name: "Charmeleon",
     type: ["Fire"],
     category: ["Flame"],
     weight: 19.0,
     height: 1.1,
     weakness: ["Water", "Rock", "Ground"],
     about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
     image: "./assets/Charmeleon.png",
     evolutions: [
      {
       id: 11,
       name: "Charizard",
       type: ["Fire", "Flying"],
       category: ["Flame"],
       weight: 90.5,
       height: 1.7,
       weakness: ["Water", "Electric", "Rock"],
       about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
       image: "./assets/Charizard.png"
      }
     ]
    }
]