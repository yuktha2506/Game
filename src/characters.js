// Character Renderer and Animation Engine for Star Friends
// Procedural vector graphics with squash-and-stretch, blinking, and accessories!

class CharacterRenderer {
    constructor() {
        this.palettes = {
            pink: { body: '#FF80AB', belly: '#FFF0F5', accent: '#FF4081', cheeks: '#FF1744' },
            blue: { body: '#80D8FF', belly: '#F0F9FF', accent: '#00B0FF', cheeks: '#FF80AB' },
            mint: { body: '#B9F6CA', belly: '#F0FFF4', accent: '#00E676', cheeks: '#FF80AB' },
            gold: { body: '#FFE57F', belly: '#FFFDE7', accent: '#FFD700', cheeks: '#FF80AB' },
            purple: { body: '#EA80FC', belly: '#FAF5FF', accent: '#AA00FF', cheeks: '#FF80AB' }
        };
    }

    // Render playable character
    draw(ctx, player) {
        ctx.save();
        ctx.translate(player.x, player.y);

        // Direction facing
        ctx.scale(player.facing, 1);

        // Squash and stretch scale factors
        ctx.scale(player.squashX || 1, player.squashY || 1);

        // Running bounce / idle breathing
        const bobY = Math.sin(player.animTimer * 12) * (player.isGrounded && Math.abs(player.vx) > 10 ? 3 : 1);
        ctx.translate(0, bobY);

        const palette = this.palettes[player.color] || this.palettes.pink;
        const charType = player.type || 'bunny';

        // Draw Superhero Cape if equipped (rendered behind body)
        if (player.hat === 'cape') {
            this.drawCape(ctx, player);
        }

        // Draw Character Body
        if (charType === 'bunny') {
            this.drawBunny(ctx, player, palette);
        } else if (charType === 'cat') {
            this.drawCat(ctx, player, palette);
        } else if (charType === 'dragon') {
            this.drawDragon(ctx, player, palette);
        }

        // Draw Hat / Accessory
        if (player.hat && player.hat !== 'none' && player.hat !== 'cape') {
            this.drawHat(ctx, player.hat);
        }

        ctx.restore();
    }

    // Bunny Character
    drawBunny(ctx, player, pal) {
        // Shadow on ground
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 18, 16, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fill();
        ctx.restore();

        // Fluffy Bunny Ears
        const earFlop = Math.sin(player.animTimer * 10) * 0.15;
        const earJumpSpread = !player.isGrounded ? 0.25 : 0;

        // Left ear
        ctx.save();
        ctx.translate(-7, -12);
        ctx.rotate(-0.2 - earJumpSpread + earFlop);
        ctx.beginPath();
        ctx.ellipse(0, -14, 5, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, -14, 2.8, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.belly;
        ctx.fill();
        ctx.restore();

        // Right ear
        ctx.save();
        ctx.translate(7, -12);
        ctx.rotate(0.2 + earJumpSpread - earFlop);
        ctx.beginPath();
        ctx.ellipse(0, -14, 5, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, -14, 2.8, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.belly;
        ctx.fill();
        ctx.restore();

        // Round Puffy Body
        ctx.beginPath();
        ctx.ellipse(0, 2, 17, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Cute Belly
        ctx.beginPath();
        ctx.ellipse(0, 5, 11, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.belly;
        ctx.fill();

        // Tiny Puffy Feet
        const footWiggle = player.isGrounded && Math.abs(player.vx) > 10 ? Math.sin(player.animTimer * 16) * 4 : 0;
        ctx.beginPath();
        ctx.ellipse(-8 + footWiggle, 17, 6, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8 - footWiggle, 17, 6, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Puffy Bunny Tail
        ctx.beginPath();
        ctx.arc(-15, 8, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Face
        this.drawFace(ctx, player, pal, false);
    }

    // Cat Character
    drawCat(ctx, player, pal) {
        // Shadow
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 18, 16, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fill();
        ctx.restore();

        // Animated Swishing Tail
        ctx.save();
        const tailAngle = Math.sin(player.animTimer * 8) * 0.4;
        ctx.translate(-12, 6);
        ctx.rotate(tailAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-12, -8, -10, -18);
        ctx.lineWidth = 4;
        ctx.strokeStyle = pal.body;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-10, -18, 3, 0, Math.PI * 2);
        ctx.fillStyle = pal.accent;
        ctx.fill();
        ctx.restore();

        // Triangular Cat Ears
        ctx.beginPath();
        // Left ear
        ctx.moveTo(-13, -8);
        ctx.lineTo(-10, -22);
        ctx.lineTo(-3, -12);
        // Right ear
        ctx.moveTo(13, -8);
        ctx.lineTo(10, -22);
        ctx.lineTo(3, -12);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Inner ear pink
        ctx.beginPath();
        ctx.moveTo(-11, -9);
        ctx.lineTo(-9, -18);
        ctx.lineTo(-4, -12);
        ctx.moveTo(11, -9);
        ctx.lineTo(9, -18);
        ctx.lineTo(4, -12);
        ctx.fillStyle = pal.accent;
        ctx.fill();

        // Chubby Body
        ctx.beginPath();
        ctx.ellipse(0, 2, 17, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Belly
        ctx.beginPath();
        ctx.ellipse(0, 5, 11, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.belly;
        ctx.fill();

        // Cute Little Paws
        const footWiggle = player.isGrounded && Math.abs(player.vx) > 10 ? Math.sin(player.animTimer * 16) * 4 : 0;
        ctx.beginPath();
        ctx.ellipse(-8 + footWiggle, 17, 5, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8 - footWiggle, 17, 5, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Bell Collar
        ctx.beginPath();
        ctx.arc(0, 8, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 8, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#E65100';
        ctx.fill();

        // Face & Whiskers
        this.drawFace(ctx, player, pal, true);
    }

    // Dragon Character
    drawDragon(ctx, player, pal) {
        // Shadow
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 18, 16, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fill();
        ctx.restore();

        // Dragon Tail with Spiky Tip
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-10, 8);
        ctx.quadraticCurveTo(-18, 10, -22, 2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = pal.body;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Tail spike
        ctx.beginPath();
        ctx.moveTo(-22, 2);
        ctx.lineTo(-27, 4);
        ctx.lineTo(-24, -2);
        ctx.closePath();
        ctx.fillStyle = pal.accent;
        ctx.fill();
        ctx.restore();

        // Animated Mini Dragon Wings
        const wingFlap = player.isGliding ? Math.sin(player.animTimer * 24) * 0.4 : Math.sin(player.animTimer * 6) * 0.15;
        ctx.save();
        ctx.translate(-8, -4);
        ctx.rotate(-0.3 + wingFlap);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-14, -14);
        ctx.lineTo(-7, -18);
        ctx.lineTo(-2, -6);
        ctx.closePath();
        ctx.fillStyle = pal.accent;
        ctx.fill();
        ctx.restore();

        // Golden Tiny Horns
        ctx.beginPath();
        ctx.moveTo(-7, -12);
        ctx.lineTo(-10, -20);
        ctx.lineTo(-4, -14);
        ctx.moveTo(7, -12);
        ctx.lineTo(10, -20);
        ctx.lineTo(4, -14);
        ctx.fillStyle = '#FFD700';
        ctx.fill();

        // Dragon Body
        ctx.beginPath();
        ctx.ellipse(0, 2, 17, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        // Scaled/Soft Belly
        ctx.beginPath();
        ctx.ellipse(0, 5, 11, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.belly;
        ctx.fill();

        // Belly stripes
        ctx.beginPath();
        ctx.moveTo(-6, 3);
        ctx.lineTo(6, 3);
        ctx.moveTo(-8, 7);
        ctx.lineTo(8, 7);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = pal.accent;
        ctx.stroke();

        // Feet
        const footWiggle = player.isGrounded && Math.abs(player.vx) > 10 ? Math.sin(player.animTimer * 16) * 4 : 0;
        ctx.beginPath();
        ctx.ellipse(-8 + footWiggle, 17, 6, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8 - footWiggle, 17, 6, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();

        this.drawFace(ctx, player, pal, false);
    }

    // Expressive face with blinking, rosy cheeks, and smile
    drawFace(ctx, player, pal, isCat) {
        // Rosy Blushing Cheeks
        ctx.beginPath();
        ctx.arc(-10, 2, 3.5, 0, Math.PI * 2);
        ctx.arc(10, 2, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 64, 129, 0.45)';
        ctx.fill();

        // Big Anime Eyes with Blinking
        const isBlinking = player.blinkTimer > 0 && player.blinkTimer < 0.15;
        if (isBlinking) {
            // Happy closed curved eyes (^_^)
            ctx.beginPath();
            ctx.arc(-6, -2, 3.5, Math.PI, 0);
            ctx.arc(6, -2, 3.5, Math.PI, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#263238';
            ctx.stroke();
        } else {
            // Shiny open eyes
            ctx.beginPath();
            ctx.ellipse(-6, -2, 3.8, 5, 0, 0, Math.PI * 2);
            ctx.ellipse(6, -2, 3.8, 5, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#212121';
            ctx.fill();

            // Eye sparkle highlights
            ctx.beginPath();
            ctx.arc(-5, -4, 1.6, 0, Math.PI * 2);
            ctx.arc(7, -4, 1.6, 0, Math.PI * 2);
            ctx.arc(-7, -1, 0.8, 0, Math.PI * 2);
            ctx.arc(5, -1, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }

        // Tiny Nose
        ctx.beginPath();
        ctx.arc(0, 1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = pal.accent;
        ctx.fill();

        // Joyful Mouth
        ctx.beginPath();
        if (!player.isGrounded && player.vy < -50) {
            // Little surprised 'o' mouth when jumping high!
            ctx.arc(0, 5, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#D81B60';
            ctx.fill();
        } else {
            // Cute smile :3
            ctx.arc(-2, 4, 2.5, 0, Math.PI * 0.8);
            ctx.arc(2, 4, 2.5, 0.2, Math.PI);
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = '#263238';
            ctx.stroke();
        }

        // Cat Whiskers
        if (isCat) {
            ctx.beginPath();
            // Left whiskers
            ctx.moveTo(-11, 2);
            ctx.lineTo(-18, 0);
            ctx.moveTo(-11, 4);
            ctx.lineTo(-18, 5);
            // Right whiskers
            ctx.moveTo(11, 2);
            ctx.lineTo(18, 0);
            ctx.moveTo(11, 4);
            ctx.lineTo(18, 5);
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = '#455A64';
            ctx.stroke();
        }
    }

    // Superhero Cape (flutters in wind)
    drawCape(ctx, player) {
        ctx.save();
        const capeWave = Math.sin(player.animTimer * 14) * 5;
        const speedTrail = Math.min(20, Math.abs(player.vx) * 0.08);

        ctx.beginPath();
        ctx.moveTo(-6, -4);
        ctx.quadraticCurveTo(-14 - speedTrail, 4 + capeWave, -18 - speedTrail, 22 + capeWave);
        ctx.quadraticCurveTo(-8, 20, -2, -4);
        ctx.closePath();
        ctx.fillStyle = '#F44336';
        ctx.fill();

        // Cape gold trim
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#FFD700';
        ctx.stroke();
        ctx.restore();
    }

    // Fun Hats & Accessories
    drawHat(ctx, hat) {
        ctx.save();
        ctx.translate(0, -13);

        if (hat === 'party') {
            // Rainbow party cone hat
            ctx.beginPath();
            ctx.moveTo(-9, 0);
            ctx.lineTo(0, -18);
            ctx.lineTo(9, 0);
            ctx.closePath();
            ctx.fillStyle = '#FF4081';
            ctx.fill();

            // Polka dots
            ctx.beginPath();
            ctx.arc(-2, -6, 2, 0, Math.PI * 2);
            ctx.arc(3, -10, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFEA00';
            ctx.fill();

            // Fluffy pompom on top
            ctx.beginPath();
            ctx.arc(0, -19, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#00E5FF';
            ctx.fill();
        } else if (hat === 'crown') {
            // Golden Royal Crown
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-11, -12);
            ctx.lineTo(-5, -6);
            ctx.lineTo(0, -14);
            ctx.lineTo(5, -6);
            ctx.lineTo(11, -12);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fillStyle = '#FFD700';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FFA000';
            ctx.stroke();

            // Ruby in center
            ctx.beginPath();
            ctx.arc(0, -5, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FF1744';
            ctx.fill();
        } else if (hat === 'flower') {
            // Cute Daisy
            ctx.translate(9, 2);
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 / 6) * i;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 5, Math.sin(angle) * 5, 3.2, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD600';
            ctx.fill();
        } else if (hat === 'chef') {
            // Puffy White Chef Hat
            ctx.beginPath();
            ctx.rect(-8, -4, 16, 5);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-6, -8, 6, 0, Math.PI * 2);
            ctx.arc(0, -12, 7, 0, Math.PI * 2);
            ctx.arc(6, -8, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        } else if (hat === 'star') {
            // Magical Star Antenna
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(3, -8, 0, -15);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#FFD700';
            ctx.stroke();

            // Glowing Star on tip
            ctx.save();
            ctx.translate(0, -18);
            ctx.rotate(Date.now() * 0.003);
            window.particles.drawStarShape(ctx, 0, 0, 5, 7, 3.5, '#FFEA00');
            ctx.restore();
        }

        ctx.restore();
    }

    // Draw baby companion pet followers in a parade line
    drawCompanion(ctx, pet, index) {
        ctx.save();
        ctx.translate(pet.x, pet.y);
        ctx.scale(pet.facing || 1, 1);

        // Gentle bounce
        const hop = Math.sin(Date.now() * 0.01 + index * 1.5) * 3;
        ctx.translate(0, hop);

        if (pet.kind === 'chick') {
            // Cute Baby Chick
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF176';
            ctx.fill();

            // Orange beak
            ctx.beginPath();
            ctx.moveTo(7, -1);
            ctx.lineTo(12, 1);
            ctx.lineTo(7, 3);
            ctx.fillStyle = '#FF9800';
            ctx.fill();

            // Eye
            ctx.beginPath();
            ctx.arc(4, -3, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#212121';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4.5, -3.5, 0.7, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Rosy cheek
            ctx.beginPath();
            ctx.arc(2, 2, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 64, 129, 0.4)';
            ctx.fill();
        } else if (pet.kind === 'bunny') {
            // Baby Bunny
            ctx.beginPath();
            ctx.ellipse(-3, -11, 2.5, 6, -0.2, 0, Math.PI * 2);
            ctx.ellipse(3, -11, 2.5, 6, 0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, 9, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(3, -2, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#212121';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(1, 2, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FF80AB';
            ctx.fill();
        } else {
            // Star Sprite
            ctx.save();
            ctx.rotate(Date.now() * 0.002);
            window.particles.drawStarShape(ctx, 0, 0, 5, 11, 5.5, '#FFD700');
            ctx.restore();

            ctx.beginPath();
            ctx.arc(2, -1, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#212121';
            ctx.fill();
        }

        ctx.restore();
    }
}

window.characters = new CharacterRenderer();
