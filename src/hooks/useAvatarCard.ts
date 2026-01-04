import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarCharacter {
  name: string;
  image: string;
  description: string;
  traits: string[];
  book: string;
}

const AVATAR_CHARACTERS: Record<string, AvatarCharacter> = {
  // Fantasy - Harry Potter
  fantasy_explorer: {
    name: "Harry Potter",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
    description: "The Boy Who Lived! Like Harry, you're drawn to magical worlds and epic adventures. Your love for fantasy reveals a brave heart that believes in the power of friendship and good over evil.",
    traits: ["Brave", "Loyal", "Adventurous"],
    book: "Harry Potter Series"
  },
  fantasy_wizard: {
    name: "Frodo Baggins",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4e/Elijah_Wood_as_Frodo_Baggins.png",
    description: "A humble hero like Frodo! Your love for fantasy shows your incredible resilience and willingness to bear great burdens for the greater good.",
    traits: ["Humble", "Resilient", "Courageous"],
    book: "The Lord of the Rings"
  },
  // Romance - Elizabeth Bennet
  romance_poet: {
    name: "Elizabeth Bennet",
    image: "https://upload.wikimedia.org/wikipedia/en/3/33/Keira_Knightley_as_Elizabeth_Bennet.jpg",
    description: "Sharp-witted and independent like Elizabeth Bennet. Your passion for romance reveals your emotional depth, wit, and belief in finding true love on your own terms.",
    traits: ["Witty", "Independent", "Passionate"],
    book: "Pride and Prejudice"
  },
  romance_dreamer: {
    name: "Jane Eyre",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Jane_Eyre_title_page.jpg",
    description: "A fiercely independent soul like Jane Eyre. Your romantic nature is balanced by strong moral principles and unwavering self-respect.",
    traits: ["Independent", "Moral", "Passionate"],
    book: "Jane Eyre"
  },
  // Mystery/Thriller - Nancy Drew
  mystery_detective: {
    name: "Nancy Drew",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a9/Nancy_Drew_Mystery_Stories_Cover_Art.jpg",
    description: "A brilliant amateur sleuth like Nancy Drew! Your love for mysteries shows your sharp analytical mind, keen intuition, and unstoppable curiosity to solve puzzles.",
    traits: ["Clever", "Curious", "Resourceful"],
    book: "Nancy Drew Mystery Series"
  },
  mystery_sleuth: {
    name: "Hercule Poirot",
    image: "https://upload.wikimedia.org/wikipedia/en/5/54/Poirot_-_David_Suchet.jpg",
    description: "A meticulous detective like Hercule Poirot! You use your little grey cells to unravel the most complex mysteries with precision and flair.",
    traits: ["Meticulous", "Brilliant", "Eccentric"],
    book: "Hercule Poirot Series"
  },
  // Sci-Fi - Paul Atreides
  scifi_voyager: {
    name: "Paul Atreides",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Paul_Atreides_Dune_2021.jpg",
    description: "A visionary leader like Paul Atreides from Dune. Your love for sci-fi reveals your forward-thinking nature and fascination with destiny, power, and the future of humanity.",
    traits: ["Visionary", "Strategic", "Prescient"],
    book: "Dune"
  },
  scifi_pioneer: {
    name: "Ender Wiggin",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e4/Ender%27s_game_cover_ISBN_0312932081.jpg",
    description: "A tactical genius like Ender Wiggin! Your sci-fi interests reveal your strategic mind and ability to see solutions others miss.",
    traits: ["Strategic", "Empathetic", "Genius"],
    book: "Ender's Game"
  },
  // Non-fiction/Self-help - Santiago (The Alchemist)
  knowledge_seeker: {
    name: "Santiago",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/TheAlchemist.jpg",
    description: "A seeker of Personal Legend like Santiago. Your preference for wisdom and growth shows your commitment to following your dreams and listening to your heart.",
    traits: ["Dreamer", "Wise", "Persistent"],
    book: "The Alchemist"
  },
  knowledge_philosopher: {
    name: "Siddhartha",
    image: "https://upload.wikimedia.org/wikipedia/en/7/74/Hesse_Siddhartha_1922.jpg",
    description: "A spiritual seeker like Siddhartha! Your quest for knowledge reflects your deep desire to understand life's meaning and find inner peace.",
    traits: ["Spiritual", "Seeking", "Wise"],
    book: "Siddhartha"
  },
  // Horror - Victor Frankenstein
  shadow_walker: {
    name: "Victor Frankenstein",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Frankenstein%27s_monster_%28Boris_Karloff%29.jpg",
    description: "A boundary-pusher like Victor Frankenstein. Your love for horror shows your courage to explore dark themes and question the limits of human ambition.",
    traits: ["Ambitious", "Intense", "Curious"],
    book: "Frankenstein"
  },
  horror_hunter: {
    name: "Van Helsing",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Dracula1st.jpeg",
    description: "A fearless hunter like Van Helsing! Your affinity for horror shows your courage to face darkness and your dedication to protecting others.",
    traits: ["Fearless", "Dedicated", "Scholarly"],
    book: "Dracula"
  },
  // Historical fiction - Jay Gatsby
  time_traveler: {
    name: "Jay Gatsby",
    image: "https://upload.wikimedia.org/wikipedia/en/8/81/Gatsby_1974_redford.jpg",
    description: "A dreamer of the past like Jay Gatsby. Your love for historical fiction shows your romantic idealism and appreciation for the grandeur of bygone eras.",
    traits: ["Romantic", "Ambitious", "Mysterious"],
    book: "The Great Gatsby"
  },
  time_warrior: {
    name: "Scarlett O'Hara",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Vivien_Leigh_Gone_Wind_Restaured.jpg",
    description: "A survivor like Scarlett O'Hara! Your love for historical drama reveals your determination, resilience, and fierce will to overcome any obstacle.",
    traits: ["Determined", "Resilient", "Bold"],
    book: "Gone with the Wind"
  },
  // Adventure - Julian from Famous Five
  adventure_seeker: {
    name: "Julian",
    image: "https://upload.wikimedia.org/wikipedia/en/5/59/Famous_Five_01_-_Five_on_a_Treasure_Island_%28front_cover%29.jpg",
    description: "A natural leader like Julian from The Famous Five. Your taste for adventure reflects your bold spirit, sense of responsibility, and hunger for thrilling outdoor escapades.",
    traits: ["Bold", "Responsible", "Adventurous"],
    book: "The Famous Five"
  },
  adventure_explorer: {
    name: "Robinson Crusoe",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Robinson_Crusoe_1719_1st_edition.jpg",
    description: "A resilient survivor like Robinson Crusoe! Your adventurous spirit shows your resourcefulness and ability to thrive in any circumstance.",
    traits: ["Resourceful", "Independent", "Survivor"],
    book: "Robinson Crusoe"
  },
  adventure_pirate: {
    name: "Jim Hawkins",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Treasure_Island-Scribner%27s-1911.jpg",
    description: "A brave young adventurer like Jim Hawkins! Your love for adventure reveals your courage to seek treasure and face pirates!",
    traits: ["Brave", "Curious", "Daring"],
    book: "Treasure Island"
  },
  // Literary fiction - Atticus Finch
  literary_artist: {
    name: "Atticus Finch",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Gregory_Peck_1948.jpg",
    description: "A moral compass like Atticus Finch. Your appreciation for literary fiction shows your thoughtful nature and commitment to justice and understanding.",
    traits: ["Wise", "Compassionate", "Principled"],
    book: "To Kill a Mockingbird"
  },
  literary_rebel: {
    name: "Holden Caulfield",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg",
    description: "A thoughtful outsider like Holden Caulfield. Your literary taste reflects your sensitivity to authenticity and your quest to understand the adult world.",
    traits: ["Sensitive", "Observant", "Authentic"],
    book: "The Catcher in the Rye"
  },
  // Comedy/Humor - Don Quixote
  comedy_jester: {
    name: "Don Quixote",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Honore_Daumier_017_%28Don_Quixote%29.jpg",
    description: "An idealistic dreamer like Don Quixote! Your love for humor shows your ability to find joy in absurdity and your belief that imagination can change the world.",
    traits: ["Idealistic", "Humorous", "Imaginative"],
    book: "Don Quixote"
  },
  comedy_wit: {
    name: "Jeeves",
    image: "https://upload.wikimedia.org/wikipedia/en/6/66/Jeeves.jpg",
    description: "An unflappable genius like Jeeves! Your appreciation for wit and humor shows your clever mind and ability to solve any problem with grace.",
    traits: ["Clever", "Composed", "Witty"],
    book: "Jeeves & Wooster Series"
  },
  // Young Adult - Katniss Everdeen
  young_adult_hero: {
    name: "Katniss Everdeen",
    image: "https://upload.wikimedia.org/wikipedia/en/3/39/Katniss_Everdeen.jpg",
    description: "A fierce survivor like Katniss Everdeen. Your love for YA shows your rebellious spirit, protective nature, and belief in fighting for what's right.",
    traits: ["Fierce", "Protective", "Resilient"],
    book: "The Hunger Games"
  },
  young_adult_wizard: {
    name: "Percy Jackson",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/The_Lightning_Thief_cover.jpg",
    description: "A demigod hero like Percy Jackson! Your YA taste shows your love for mythology, loyalty to friends, and ability to find humor in danger.",
    traits: ["Loyal", "Heroic", "Witty"],
    book: "Percy Jackson Series"
  },
  young_adult_rebel: {
    name: "Tris Prior",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5c/Divergent_%28book%29_by_Veronica_Roth_US_Hardcover_2011.jpg",
    description: "A brave Divergent like Tris Prior! Your reading taste reflects your refusal to fit into a single category and courage to be yourself.",
    traits: ["Brave", "Selfless", "Divergent"],
    book: "Divergent"
  },
  // Poetry - Rumi
  poetry_muse: {
    name: "Rumi",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Maulana_Rumi.jpg",
    description: "A soul touched by divine words like Rumi. Your affinity for poetry reveals your deep spirituality, sensitivity to beauty, and quest for transcendent love.",
    traits: ["Spiritual", "Poetic", "Loving"],
    book: "Rumi's Poetry Collections"
  },
  poetry_romantic: {
    name: "Emily Dickinson",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Emily_Dickinson_daguerreotype_%28cropped%29.jpg",
    description: "A reclusive genius like Emily Dickinson! Your love for poetry shows your rich inner world and ability to find profound beauty in small moments.",
    traits: ["Introspective", "Brilliant", "Unique"],
    book: "Emily Dickinson's Poems"
  },
  // Memoir/Autobiography - Anne Frank
  memoir_chronicler: {
    name: "Anne Frank",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Anne_Frank_passport_photo%2C_May_1942.jpg",
    description: "A hopeful chronicler like Anne Frank. Your love for memoirs shows your deep empathy, belief in humanity's goodness, and appreciation for authentic stories.",
    traits: ["Hopeful", "Empathetic", "Reflective"],
    book: "The Diary of a Young Girl"
  },
  // Crime - Sherlock Holmes
  crime_solver: {
    name: "Sherlock Holmes",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Sherlock_Holmes_Portrait_Paget.jpg",
    description: "The world's greatest detective! Like Sherlock Holmes, you possess exceptional observational skills and a brilliant deductive mind that craves intellectual challenges.",
    traits: ["Brilliant", "Observant", "Logical"],
    book: "Sherlock Holmes Series"
  },
  crime_mastermind: {
    name: "Miss Marple",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f3/Joan_Hickson_Miss_Marple.jpg",
    description: "A keen observer like Miss Marple! Your crime fiction taste shows your belief that human nature is the same everywhere, and your sharp eye for detail.",
    traits: ["Observant", "Wise", "Unassuming"],
    book: "Miss Marple Series"
  },
  // Community champion - Gandalf
  community_champion: {
    name: "Gandalf",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg",
    description: "A wise guide like Gandalf! Your high engagement shows your passion for bringing readers together and guiding others on their literary journeys.",
    traits: ["Wise", "Inspiring", "Leader"],
    book: "The Lord of the Rings"
  },
  // Children's classics
  childrens_dreamer: {
    name: "Alice",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Alice_par_John_Tenniel_02.png",
    description: "A curious adventurer like Alice! Your whimsical taste shows your open-minded nature and love for exploring impossible worlds.",
    traits: ["Curious", "Imaginative", "Bold"],
    book: "Alice in Wonderland"
  },
  childrens_hero: {
    name: "Peter Pan",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Peter_Pan_1915_cover_2.jpg",
    description: "A forever-young spirit like Peter Pan! Your reading taste reflects your refusal to lose your sense of wonder and adventure.",
    traits: ["Youthful", "Adventurous", "Free-spirited"],
    book: "Peter Pan"
  },
  // Thriller
  thriller_spy: {
    name: "James Bond",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c5/Fleming007impression.jpg",
    description: "A suave agent like James Bond! Your thriller taste reveals your love for action, sophistication, and living on the edge.",
    traits: ["Suave", "Daring", "Resourceful"],
    book: "James Bond Series"
  },
  thriller_investigator: {
    name: "Robert Langdon",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Da_Vinci_Code.jpg",
    description: "A symbologist like Robert Langdon! Your thriller taste shows your love for codes, history, and unraveling ancient mysteries.",
    traits: ["Scholarly", "Quick-thinking", "Curious"],
    book: "The Da Vinci Code"
  },
  // Gothic/Dark Romance
  gothic_romantic: {
    name: "Heathcliff",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wuthering_Heights_1939_Olivier.jpg",
    description: "A passionate soul like Heathcliff! Your dark romantic nature reveals intense emotions and a love that transcends conventional boundaries.",
    traits: ["Passionate", "Intense", "Brooding"],
    book: "Wuthering Heights"
  },
  gothic_heroine: {
    name: "Catherine Earnshaw",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Emily_Bront%C3%AB_by_Patrick_Branwell_Bront%C3%AB_restored.jpg",
    description: "A wild spirit like Catherine! Your reading taste reflects your fierce independence and connection to nature's raw power.",
    traits: ["Wild", "Passionate", "Free-spirited"],
    book: "Wuthering Heights"
  },
  // Classic Literature
  classic_gentleman: {
    name: "Mr. Darcy",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b3/Colin_Firth_Mr_Darcy.jpg",
    description: "A proud but good-hearted soul like Mr. Darcy! Your literary taste shows depth beneath a reserved exterior.",
    traits: ["Proud", "Loyal", "Honorable"],
    book: "Pride and Prejudice"
  },
  classic_dreamer: {
    name: "Emma Bovary",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Madame_Bovary_1857.jpg",
    description: "A romantic idealist like Emma Bovary! Your taste reveals a longing for beauty and passion beyond ordinary life.",
    traits: ["Romantic", "Dreamer", "Passionate"],
    book: "Madame Bovary"
  },
  // Russian Literature
  russian_soul: {
    name: "Raskolnikov",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dostoevsky_1872.jpg",
    description: "A complex thinker like Raskolnikov! Your reading reveals deep philosophical questioning and moral exploration.",
    traits: ["Philosophical", "Complex", "Intense"],
    book: "Crime and Punishment"
  },
  russian_prince: {
    name: "Prince Myshkin",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dostoevsky_The_Idiot_cover.jpg",
    description: "A pure soul like Prince Myshkin! Your literary taste reflects innocence, compassion, and seeing good in everyone.",
    traits: ["Innocent", "Compassionate", "Pure"],
    book: "The Idiot"
  },
  russian_aristocrat: {
    name: "Anna Karenina",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Anna_Karenina_1877_cover.jpg",
    description: "A passionate aristocrat like Anna Karenina! Your reading taste reveals deep emotions and tragic beauty.",
    traits: ["Passionate", "Tragic", "Beautiful"],
    book: "Anna Karenina"
  },
  // Magical Realism
  magical_realist: {
    name: "Remedios the Beauty",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a9/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
    description: "An ethereal being like Remedios! Your taste for magical realism shows appreciation for wonder in everyday life.",
    traits: ["Ethereal", "Innocent", "Magical"],
    book: "One Hundred Years of Solitude"
  },
  // Japanese Literature
  japanese_wanderer: {
    name: "Musashi Miyamoto",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Miyamoto_Musashi_Self-Portrait.jpg",
    description: "A disciplined warrior like Musashi! Your reading reveals dedication to mastery and the way of self-improvement.",
    traits: ["Disciplined", "Wise", "Warrior"],
    book: "Musashi"
  },
  japanese_prince: {
    name: "Prince Genji",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Tosa_Mitsuoki_-_Genji_monogatari.jpg",
    description: "An aesthetic soul like Prince Genji! Your taste reveals appreciation for beauty, art, and refined emotions.",
    traits: ["Aesthetic", "Romantic", "Cultured"],
    book: "The Tale of Genji"
  },
  // American Classics
  american_captain: {
    name: "Captain Ahab",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Moby_Dick_p510_illustration.jpg",
    description: "An obsessive seeker like Captain Ahab! Your reading reveals determination and pursuit of the impossible.",
    traits: ["Obsessive", "Determined", "Intense"],
    book: "Moby Dick"
  },
  american_rebel: {
    name: "Huckleberry Finn",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/Huckleberry_Finn_book.JPG",
    description: "A free spirit like Huck Finn! Your taste reveals independence, moral courage, and love for adventure.",
    traits: ["Free-spirited", "Moral", "Adventurous"],
    book: "Adventures of Huckleberry Finn"
  },
  // Epic Heroes
  epic_warrior: {
    name: "Achilles",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Achilles_and_Penthesilea_fighting%2C_Staatliche_Antikensammlungen_8705.jpg",
    description: "A legendary warrior like Achilles! Your taste for epics shows love for heroism, glory, and fateful destinies.",
    traits: ["Heroic", "Proud", "Legendary"],
    book: "The Iliad"
  },
  epic_voyager: {
    name: "Odysseus",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Arnold_B%C3%B6cklin_-_Odysseus_and_Polyphemus.jpg",
    description: "A cunning voyager like Odysseus! Your reading reveals cleverness, resilience, and longing for home.",
    traits: ["Cunning", "Resilient", "Adventurous"],
    book: "The Odyssey"
  },
  // Modern Dystopia
  dystopia_rebel: {
    name: "Winston Smith",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg",
    description: "A truth-seeker like Winston Smith! Your dystopian taste reveals concern for freedom and truth in society.",
    traits: ["Rebellious", "Thoughtful", "Brave"],
    book: "1984"
  },
  dystopia_savage: {
    name: "Bernard Marx",
    image: "https://upload.wikimedia.org/wikipedia/en/6/62/BraveNewWorld_FirstEdition.jpg",
    description: "An outsider like Bernard Marx! Your reading reveals questioning of societal norms and search for authenticity.",
    traits: ["Outsider", "Questioning", "Sensitive"],
    book: "Brave New World"
  },
  // Fantasy Additional
  fantasy_queen: {
    name: "Daenerys Targaryen",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0d/Daenerys_Targaryen_with_Dragon-Emilia_Clarke.jpg",
    description: "A mother of dragons like Daenerys! Your fantasy taste reveals ambition, strength, and desire for justice.",
    traits: ["Ambitious", "Powerful", "Liberator"],
    book: "A Song of Ice and Fire"
  },
  fantasy_knight: {
    name: "Aragorn",
    image: "https://upload.wikimedia.org/wikipedia/en/3/35/Aragorn300ppx.jpg",
    description: "A rightful king like Aragorn! Your fantasy taste shows nobility, courage, and readiness to accept destiny.",
    traits: ["Noble", "Brave", "Leader"],
    book: "The Lord of the Rings"
  },
  fantasy_assassin: {
    name: "Kvothe",
    image: "https://upload.wikimedia.org/wikipedia/en/5/56/TheNameoftheWind_cover.jpg",
    description: "A legendary figure like Kvothe! Your fantasy taste reveals love for music, magic, and becoming a legend.",
    traits: ["Talented", "Mysterious", "Legendary"],
    book: "The Name of the Wind"
  },
  // Humor Additional
  humor_eccentric: {
    name: "Ignatius J. Reilly",
    image: "https://upload.wikimedia.org/wikipedia/en/6/66/ConfederacyOfDunces.jpg",
    description: "A magnificent eccentric like Ignatius! Your humor taste reveals appreciation for absurdity and unique perspectives.",
    traits: ["Eccentric", "Intellectual", "Unique"],
    book: "A Confederacy of Dunces"
  },
  // Gothic Horror
  gothic_count: {
    name: "Count Dracula",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c8/Bela_Lugosi_as_Dracula_%28Universal%29.jpg",
    description: "A lord of darkness like Dracula! Your gothic taste reveals fascination with immortality and the supernatural.",
    traits: ["Mysterious", "Powerful", "Immortal"],
    book: "Dracula"
  },
  gothic_doctor: {
    name: "Dr. Jekyll",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dr_Jekyll_and_Mr_Hyde_poster_edit2.jpg",
    description: "A dual nature like Dr. Jekyll! Your reading reveals fascination with humanity's light and dark sides.",
    traits: ["Dual", "Scientific", "Tragic"],
    book: "The Strange Case of Dr Jekyll and Mr Hyde"
  },
  // Children's Additional
  childrens_wizard: {
    name: "Mary Poppins",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e9/Mary_Poppins5.jpg",
    description: "Practically perfect like Mary Poppins! Your reading reveals love for magic hidden in ordinary life.",
    traits: ["Magical", "Proper", "Mysterious"],
    book: "Mary Poppins"
  },
  childrens_bear: {
    name: "Winnie-the-Pooh",
    image: "https://upload.wikimedia.org/wikipedia/en/1/10/Winniethepooh.png",
    description: "A bear of very little brain like Pooh! Your taste reveals simple wisdom, friendship, and love for honey.",
    traits: ["Simple", "Loyal", "Wise"],
    book: "Winnie-the-Pooh"
  },
  childrens_orphan: {
    name: "Anne Shirley",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Anne_of_Green_Gables_title_page.jpg",
    description: "An imaginative spirit like Anne! Your reading reveals optimism, creativity, and romantic imagination.",
    traits: ["Imaginative", "Optimistic", "Spirited"],
    book: "Anne of Green Gables"
  },
  // Science Fiction Additional
  scifi_android: {
    name: "R. Daneel Olivaw",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8e/Robot_series_omnibus_cover.jpg",
    description: "A faithful robot like Daneel! Your sci-fi taste reveals questions about humanity and artificial life.",
    traits: ["Logical", "Loyal", "Ethical"],
    book: "The Robot Series"
  },
  scifi_pilot: {
    name: "Valentine Michael Smith",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d3/StrangerInAStrangeLand.jpg",
    description: "A stranger in a strange land like Michael! Your sci-fi taste reveals openness to alien perspectives.",
    traits: ["Innocent", "Powerful", "Loving"],
    book: "Stranger in a Strange Land"
  },
  // Default - Hermione Granger
  balanced_reader: {
    name: "Hermione Granger",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg",
    description: "A voracious reader like Hermione Granger! Your diverse reading habits show your incredible thirst for knowledge and ability to find wisdom in every genre.",
    traits: ["Brilliant", "Studious", "Loyal"],
    book: "Harry Potter Series"
  }
};

const GENRE_MAPPING: Record<string, string> = {
  'fantasy': 'fantasy_explorer',
  'romance': 'romance_poet',
  'mystery': 'mystery_detective',
  'thriller': 'mystery_detective',
  'science fiction': 'scifi_voyager',
  'sci-fi': 'scifi_voyager',
  'non-fiction': 'knowledge_seeker',
  'self-help': 'knowledge_seeker',
  'philosophy': 'knowledge_seeker',
  'horror': 'shadow_walker',
  'gothic': 'shadow_walker',
  'historical fiction': 'time_traveler',
  'history': 'time_traveler',
  'biography': 'memoir_chronicler',
  'adventure': 'adventure_seeker',
  'action': 'adventure_seeker',
  'literary fiction': 'literary_artist',
  'classics': 'literary_artist',
  'comedy': 'comedy_jester',
  'humor': 'comedy_jester',
  'satire': 'comedy_jester',
  'young adult': 'young_adult_hero',
  'ya': 'young_adult_hero',
  'dystopian': 'young_adult_hero',
  'poetry': 'poetry_muse',
  'memoir': 'memoir_chronicler',
  'autobiography': 'memoir_chronicler',
  'crime': 'crime_solver',
  'detective': 'crime_solver',
};

export const useAvatarCard = (userId: string | undefined) => {
  const [character, setCharacter] = useState<AvatarCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      calculateAvatar();
    }
  }, [userId]);

  const calculateAvatar = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Get user's favorite genre
      const { data: profile } = await supabase
        .from('profiles')
        .select('favorite_genre')
        .eq('id', userId)
        .maybeSingle();

      // Get genres from books user has uploaded
      const { data: userBooks } = await supabase
        .from('books')
        .select('id')
        .eq('created_by', userId);

      const bookIds = userBooks?.map(b => b.id) || [];
      
      // Get genres from user's books
      let bookGenres: string[] = [];
      if (bookIds.length > 0) {
        const { data: bookGenreData } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', bookIds);
        
        bookGenres = bookGenreData?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Get genres from books user has upvoted
      const { data: userVotes } = await supabase
        .from('votes')
        .select('votable_id')
        .eq('user_id', userId)
        .eq('votable_type', 'book')
        .eq('value', 1);

      const votedBookIds = userVotes?.map(v => v.votable_id) || [];
      
      let votedGenres: string[] = [];
      if (votedBookIds.length > 0) {
        const { data: votedBookGenres } = await supabase
          .from('book_genres')
          .select('genres(name)')
          .in('book_id', votedBookIds);
        
        votedGenres = votedBookGenres?.map((bg: any) => bg.genres?.name?.toLowerCase()).filter(Boolean) || [];
      }

      // Count threads started
      const { count: threadCount } = await supabase
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      // Count total votes given
      const { count: voteCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Determine avatar based on engagement and genres
      const allGenres = [
        ...(profile?.favorite_genre ? [profile.favorite_genre.toLowerCase()] : []),
        ...bookGenres,
        ...votedGenres
      ];

      // Count genre occurrences
      const genreCounts: Record<string, number> = {};
      allGenres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Find dominant genre
      let dominantGenre = '';
      let maxCount = 0;
      Object.entries(genreCounts).forEach(([genre, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantGenre = genre;
        }
      });

      // Check for high engagement (community champion)
      const totalEngagement = (threadCount || 0) + (voteCount || 0) + (userBooks?.length || 0);
      if (totalEngagement >= 20) {
        setCharacter(AVATAR_CHARACTERS.community_champion);
      } else if (dominantGenre && GENRE_MAPPING[dominantGenre]) {
        setCharacter(AVATAR_CHARACTERS[GENRE_MAPPING[dominantGenre]]);
      } else if (profile?.favorite_genre) {
        const favoriteKey = GENRE_MAPPING[profile.favorite_genre.toLowerCase()];
        if (favoriteKey) {
          setCharacter(AVATAR_CHARACTERS[favoriteKey]);
        } else {
          setCharacter(AVATAR_CHARACTERS.balanced_reader);
        }
      } else {
        setCharacter(AVATAR_CHARACTERS.balanced_reader);
      }
    } catch (error) {
      console.error('Error calculating avatar:', error);
      setCharacter(AVATAR_CHARACTERS.balanced_reader);
    } finally {
      setLoading(false);
    }
  };

  return { character, loading };
};
