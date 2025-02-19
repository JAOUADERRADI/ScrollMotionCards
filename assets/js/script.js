document.addEventListener("DOMContentLoaded", () => {
  // Initialise Lenis pour le défilement fluide
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  // Synchronise Lenis avec GSAP
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Désactive le lissage du décalage de GSAP
  gsap.ticker.lagSmoothing(0);

  const cursor = document.querySelector(".custom-cursor");

  // Met à jour la position du curseur personnalisé en fonction de la position de la souris
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Sélectionne toutes les cartes et définit les rotations initiales
  const cards = gsap.utils.toArray(".card");
  const rotations = [-12, 10, -5, 5, -5, -2];

  // Initialise la position et la rotation de chaque carte
  cards.forEach((card, index) => {
    gsap.set(card, {
      y: window.innerHeight,
      rotate: rotations[index],
    });
  });

  // Crée un ScrollTrigger pour l'animation des cartes
  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalCards = cards.length;
      const progressPerCard = 1 / totalCards;

      // Parcourt chaque carte pour appliquer les animations en fonction de la progression
      cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        let cardProgress = (progress - cardStart) / progressPerCard;
        cardProgress = Math.min(Math.max(cardProgress, 0), 1);

        let yPos = window.innerHeight * (1 - cardProgress);
        let xPos = 0;
        // Applique un décalage horizontal et vertical supplémentaire pour les cartes après leur apparition
        if (cardProgress === 1 && index < totalCards - 1) {
          const remainingProgress = (progress - (cardStart - progressPerCard)) / (1 - (card + progressPerCard));

          // const remainingProgress = (progress - (cardStart - progressPerCard)) / (1 - (cardStart + progressPerCard));

          // const remainingProgress = (progress - cardStart) / (1 - cardStart);

          if (remainingProgress > 0) {
            const distanceMultiplier = 1 - index * 0.15;
            xPos =
              -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
            yPos =
              -window.innerHeight *
              0.3 *
              distanceMultiplier *
              remainingProgress;
          }
        }

        // Applique l'animation de position et de rotation à la carte
        gsap.to(card, {
          y: yPos,
          x: xPos,
          duration: 1.5,
          ease: "power4.out",
        });
      });
    },
  });
});
