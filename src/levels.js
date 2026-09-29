// Level Layouts, World Themes, and Environmental Renderer for Star Friends

class LevelManager {
    constructor() {
        this.levels = [
            this.createCandyMeadow(),
            this.createCloudKingdom(),
            this.createCosmicCove()
        ];
    }

    getLevel(index) {
        return JSON.parse(JSON.stringify(this.levels[index % this.levels.length]));
    }

    // World 1: Candy Meadow
    createCandyMeadow() {
        return {
            id: 1,
            name: "Candy Meadow",
            subtitle: "Bounce on jellies & rescue Baby Barnaby!",
            width: 3200,
            height: 900,
            skyGradient: ['#E0F7FA', '#FFF9C4', '#F8BBD0'],
            groundColor: '#7CB342',
            groundTopColor: '#9CCC65',
            subGroundColor: '#5D4037',
            spawn: { x: 100, y: 650 },
            platforms: [
                // Floor chunks with small fun gaps
                { x: 0, y: 720, w: 750, h: 180, type: 'solid' },
                { x: 850, y: 720, w: 900, h: 180, type: 'solid' },
                { x: 1850, y: 720, w: 1400, h: 180, type: 'solid' },

                // Floating biscuit & candy platforms
                { x: 260, y: 580, w: 140, h: 26, type: 'biscuit' },
                { x: 440, y: 460, w: 150, h: 26, type: 'biscuit' },
                { x: 620, y: 350, w: 160, h: 26, type: 'biscuit' },

                // Floating chocolate bridges
                { x: 920, y: 560, w: 130, h: 24, type: 'biscuit' },
                { x: 1120, y: 440, w: 140, h: 24, type: 'biscuit' },
                { x: 1320, y: 340, w: 180, h: 24, type: 'biscuit' },

                // Moving candy waffle platform
                { x: 1580, y: 480, w: 130, h: 24, type: 'moving', vx: 80, minX: 1520, maxX: 1800 },

                // Upper secret route
                { x: 1950, y: 520, w: 140, h: 24, type: 'biscuit' },
                { x: 2160, y: 400, w: 160, h: 24, type: 'biscuit' },
                { x: 2400, y: 320, w: 200, h: 24, type: 'biscuit' },
                { x: 2680, y: 440, w: 150, h: 24, type: 'biscuit' }
            ],
            trampolines: [
                // Bouncy Strawberry Jelly Mushrooms!
                { x: 760, y: 690, w: 60, h: 30, power: -720, color: '#FF4081' },
                { x: 1770, y: 690, w: 60, h: 30, power: -760, color: '#FF4081' },
                { x: 1150, y: 416, w: 50, h: 24, power: -650, color: '#00E676' }
            ],
            stars: [
                // Trail 1
                { x: 290, y: 530 }, { x: 330, y: 530 },
                { x: 470, y: 410 }, { x: 510, y: 410 },
                { x: 650, y: 300 }, { x: 700, y: 300 },
                // Arch over first trampoline
                { x: 770, y: 520 }, { x: 790, y: 430 }, { x: 820, y: 520 },
                // Mid section
                { x: 970, y: 510 }, { x: 1170, y: 390 },
                { x: 1370, y: 290 }, { x: 1410, y: 290 },
                { x: 1640, y: 430 }, { x: 1720, y: 430 },
                // Upper ridge
                { x: 2000, y: 470 }, { x: 2210, y: 350 }, { x: 2450, y: 270 }, { x: 2500, y: 270 },
                { x: 2730, y: 390 },
                // End carpet
                { x: 2900, y: 670 }, { x: 2950, y: 670 }, { x: 3000, y: 670 }
            ],
            key: { x: 1400, y: 280, id: 'candy_key' },
            cage: {
                x: 2470, y: 260,
                keyId: 'candy_key',
                petKind: 'bunny',
                petName: 'Baby Barnaby',
                freed: false
            },
            checkpoint: { x: 1250, y: 660, active: false },
            goal: { x: 3060, y: 620, w: 80, h: 100 }
        };
    }

    // World 2: Rainbow Cloud Kingdom
    createCloudKingdom() {
        return {
            id: 2,
            name: "Cloud Kingdom",
            subtitle: "Float high on clouds & rescue Pippin the Chick!",
            width: 3500,
            height: 900,
            skyGradient: ['#B3E5FC', '#FFF0F5', '#FFE082'],
            groundColor: '#81D4FA',
            groundTopColor: '#E1F5FE',
            subGroundColor: '#0288D1',
            spawn: { x: 100, y: 650 },
            platforms: [
                // Floating Cloud Islands
                { x: 0, y: 720, w: 600, h: 180, type: 'cloud' },
                { x: 700, y: 660, w: 220, h: 50, type: 'cloud' },
                { x: 1000, y: 560, w: 200, h: 50, type: 'cloud' },
                { x: 1280, y: 450, w: 240, h: 50, type: 'cloud' },

                // Vertical moving bubble cloud
                { x: 1600, y: 520, w: 140, h: 36, type: 'moving', vy: 70, minY: 320, maxY: 620 },

                // High sky clouds
                { x: 1820, y: 360, w: 220, h: 46, type: 'cloud' },
                { x: 2120, y: 460, w: 180, h: 46, type: 'cloud' },
                { x: 2380, y: 560, w: 200, h: 46, type: 'cloud' },

                // Rainbow highway
                { x: 2650, y: 440, w: 320, h: 36, type: 'rainbow' },

                // Landing Island
                { x: 3050, y: 700, w: 500, h: 200, type: 'cloud' }
            ],
            trampolines: [
                { x: 480, y: 690, w: 60, h: 30, power: -780, color: '#00E5FF' },
                { x: 1100, y: 536, w: 50, h: 24, power: -720, color: '#FFD700' },
                { x: 2220, y: 436, w: 50, h: 24, power: -750, color: '#FF4081' }
            ],
            stars: [
                { x: 240, y: 660 }, { x: 320, y: 660 },
                { x: 500, y: 480 }, { x: 520, y: 400 },
                { x: 750, y: 600 }, { x: 800, y: 600 },
                { x: 1050, y: 500 }, { x: 1120, y: 380 },
                { x: 1340, y: 390 }, { x: 1400, y: 390 },
                { x: 1660, y: 320 },
                { x: 1880, y: 300 }, { x: 1940, y: 300 },
                { x: 2160, y: 400 }, { x: 2420, y: 500 },
                // Stars along rainbow highway
                { x: 2700, y: 390 }, { x: 2760, y: 390 }, { x: 2820, y: 390 }, { x: 2880, y: 390 },
                { x: 3200, y: 640 }, { x: 3260, y: 640 }
            ],
            key: { x: 1920, y: 290, id: 'cloud_key' },
            cage: {
                x: 2780, y: 380,
                keyId: 'cloud_key',
                petKind: 'chick',
                petName: 'Pippin the Chick',
                freed: false
            },
            checkpoint: { x: 1700, y: 720, active: false },
            goal: { x: 3380, y: 600, w: 80, h: 100 }
        };
    }

    // World 3: Cosmic Cove
    createCosmicCove() {
        return {
            id: 3,
            name: "Cosmic Cove",
            subtitle: "Fly through starlight & rescue Stella the Star!",
            width: 3600,
            height: 900,
            skyGradient: ['#1A237E', '#4A148C', '#880E4F'],
            groundColor: '#311B92',
            groundTopColor: '#7C4DFF',
            subGroundColor: '#12005E',
            spawn: { x: 100, y: 650 },
            platforms: [
                // Neon floating crystal asteroids
                { x: 0, y: 720, w: 550, h: 180, type: 'crystal' },
                { x: 620, y: 620, w: 180, h: 36, type: 'crystal' },
                { x: 880, y: 500, w: 200, h: 36, type: 'crystal' },

                // Double horizontal crystal cruisers
                { x: 1180, y: 420, w: 140, h: 30, type: 'moving', vx: 90, minX: 1150, maxX: 1450 },
                { x: 1520, y: 340, w: 140, h: 30, type: 'moving', vx: -80, minX: 1480, maxX: 1780 },

                // High crystal pillars
                { x: 1850, y: 440, w: 180, h: 36, type: 'crystal' },
                { x: 2100, y: 340, w: 220, h: 36, type: 'crystal' },
                { x: 2400, y: 460, w: 180, h: 36, type: 'crystal' },

                // Cosmic floating bridge
                { x: 2680, y: 560, w: 320, h: 40, type: 'crystal' },
                { x: 3100, y: 700, w: 500, h: 200, type: 'crystal' }
            ],
            trampolines: [
                { x: 420, y: 690, w: 60, h: 30, power: -820, color: '#E040FB' },
                { x: 940, y: 476, w: 50, h: 24, power: -740, color: '#00E5FF' },
                { x: 1900, y: 416, w: 50, h: 24, power: -800, color: '#FFEA00' }
            ],
            stars: [
                { x: 200, y: 650 }, { x: 270, y: 650 },
                { x: 440, y: 490 }, { x: 460, y: 390 },
                { x: 670, y: 560 }, { x: 720, y: 560 },
                { x: 920, y: 430 },
                { x: 1280, y: 360 }, { x: 1600, y: 280 },
                { x: 2150, y: 280 }, { x: 2220, y: 280 },
                { x: 2450, y: 390 },
                // Stardust loop
                { x: 2740, y: 490 }, { x: 2800, y: 490 }, { x: 2860, y: 490 }, { x: 2920, y: 490 },
                { x: 3250, y: 640 }, { x: 3320, y: 640 }, { x: 3390, y: 640 }
            ],
            key: { x: 2200, y: 270, id: 'cosmic_key' },
            cage: {
                x: 2840, y: 500,
                keyId: 'cosmic_key',
                petKind: 'star',
                petName: 'Stella the Star',
                freed: false
            },
            checkpoint: { x: 1880, y: 400, active: false },
            goal: { x: 3400, y: 600, w: 80, h: 100 }
        };
    }

    // Render themed background with parallax
    drawBackground(ctx, level, cameraX, cameraY, time) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Sky Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, level.skyGradient[0]);
        grad.addColorStop(0.5, level.skyGradient[1]);
        grad.addColorStop(1, level.skyGradient[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Parallax Layer 1: Distant hills / clouds / nebula
        ctx.save();
        if (level.id === 1) {
            // Candy Meadow: Pastel rolling hills
            ctx.fillStyle = 'rgba(255, 182, 193, 0.45)';
            this.drawRollingHills(ctx, cameraX * 0.15, h - 180, 220, 80, w);
            ctx.fillStyle = 'rgba(174, 213, 129, 0.55)';
            this.drawRollingHills(ctx, cameraX * 0.3 + 100, h - 120, 160, 50, w);
        } else if (level.id === 2) {
            // Cloud Kingdom: Fluffy drifting clouds & rainbow
            this.drawGiantRainbow(ctx, cameraX * 0.1, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.drawDriftingClouds(ctx, cameraX * 0.2, time, w, h);
        } else {
            // Cosmic Cove: Twinkling distant stars & nebula glow
            this.drawCosmicStars(ctx, cameraX * 0.1, time, w, h);
            this.drawNebulaMoons(ctx, cameraX * 0.05, w, h);
        }
        ctx.restore();
    }

    drawRollingHills(ctx, offsetX, baseY, hillWidth, hillHeight, canvasWidth) {
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);
        const startIdx = Math.floor(offsetX / hillWidth) - 1;
        const count = Math.ceil(canvasWidth / hillWidth) + 3;

        for (let i = 0; i <= count; i++) {
            const hx = (startIdx + i) * hillWidth - (offsetX % hillWidth);
            ctx.quadraticCurveTo(hx + hillWidth / 2, baseY - hillHeight, hx + hillWidth, baseY);
        }
        ctx.lineTo(canvasWidth, ctx.canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    drawGiantRainbow(ctx, offsetX, canvasHeight) {
        ctx.save();
        const rx = 400 - (offsetX % 800);
        const ry = canvasHeight - 100;
        const colors = ['#FF1744', '#FF9100', '#FFEA00', '#00E676', '#00E5FF', '#D500F9'];
        for (let i = 0; i < colors.length; i++) {
            ctx.beginPath();
            ctx.arc(rx, ry, 320 - i * 10, Math.PI, 0);
            ctx.lineWidth = 11;
            ctx.strokeStyle = colors[i];
            ctx.globalAlpha = 0.4;
            ctx.stroke();
        }
        ctx.restore();
    }

    drawDriftingClouds(ctx, offsetX, time, w, h) {
        for (let i = 0; i < 6; i++) {
            const cx = ((i * 320 + time * 15 - offsetX) % (w + 400)) - 100;
            const cy = 80 + (i % 3) * 70;
            ctx.beginPath();
            ctx.arc(cx, cy, 35, 0, Math.PI * 2);
            ctx.arc(cx + 28, cy - 12, 28, 0, Math.PI * 2);
            ctx.arc(cx + 56, cy, 32, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawCosmicStars(ctx, offsetX, time, w, h) {
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 45; i++) {
            const sx = ((i * 97 + i * 23 - offsetX) % w + w) % w;
            const sy = (i * 47) % (h - 150);
            const twinkle = Math.sin(time * 3 + i) * 0.5 + 0.5;
            ctx.globalAlpha = 0.3 + twinkle * 0.7;
            ctx.beginPath();
            ctx.arc(sx, sy, (i % 3) + 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    drawNebulaMoons(ctx, offsetX, w, h) {
        // Glowing Crescent Moon
        const mx = w - 180 - (offsetX % 200);
        const my = 120;
        ctx.beginPath();
        ctx.arc(mx, my, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE082';
        ctx.shadowColor = '#FFD54F';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cutout to make crescent
        ctx.beginPath();
        ctx.arc(mx + 16, my - 6, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#281564';
        ctx.fill();
    }

    // Render interactive platforms
    drawPlatform(ctx, plat) {
        ctx.save();
        if (plat.type === 'solid' || plat.type === 'crystal') {
            // Rounded Grass / Crystal ground
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, [16, 16, 0, 0]);
            ctx.fillStyle = plat.type === 'crystal' ? '#7C4DFF' : '#7CB342';
            ctx.fill();

            // Lush top grass/crystal trim
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, 14, [16, 16, 0, 0]);
            ctx.fillStyle = plat.type === 'crystal' ? '#B388FF' : '#9CCC65';
            ctx.fill();

            // Decorative cartoon dots/flowers
            for (let dx = 20; dx < plat.w - 20; dx += 40) {
                ctx.beginPath();
                ctx.arc(plat.x + dx, plat.y + 7, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
            }
        } else if (plat.type === 'biscuit') {
            // Sweet waffle / cookie floating platform
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 12);
            ctx.fillStyle = '#FFB74D';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#F57C00';
            ctx.stroke();

            // Biscuit cream filling stripe
            ctx.fillStyle = '#FFF8E1';
            ctx.fillRect(plat.x + 4, plat.y + plat.h / 2 - 2, plat.w - 8, 4);
        } else if (plat.type === 'cloud') {
            // Puffy cloud platform
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 24);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0, 180, 255, 0.2)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Little cloud puffs
            ctx.beginPath();
            ctx.arc(plat.x + 15, plat.y + 6, 14, 0, Math.PI * 2);
            ctx.arc(plat.x + plat.w - 15, plat.y + 6, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        } else if (plat.type === 'rainbow') {
            // Rainbow strip platform
            const colors = ['#FF4081', '#FFD700', '#00E676', '#00B0FF'];
            const barH = plat.h / colors.length;
            colors.forEach((col, idx) => {
                ctx.fillStyle = col;
                ctx.fillRect(plat.x, plat.y + idx * barH, plat.w, barH);
            });
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
        } else if (plat.type === 'moving') {
            // Moving floating tech / candy pad
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 10);
            ctx.fillStyle = '#FFD54F';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#FFA000';
            ctx.stroke();

            // Animated glowing wings or arrows
            const glow = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
            ctx.globalAlpha = glow;
            ctx.fillStyle = '#FF6F00';
            ctx.beginPath();
            ctx.moveTo(plat.x + 15, plat.y + plat.h / 2);
            ctx.lineTo(plat.x + 25, plat.y + plat.h / 2 - 5);
            ctx.lineTo(plat.x + 25, plat.y + plat.h / 2 + 5);
            ctx.moveTo(plat.x + plat.w - 15, plat.y + plat.h / 2);
            ctx.lineTo(plat.x + plat.w - 25, plat.y + plat.h / 2 - 5);
            ctx.lineTo(plat.x + plat.w - 25, plat.y + plat.h / 2 + 5);
            ctx.fill();
        }
        ctx.restore();
    }

    // Render interactive bouncy jelly pad
    drawTrampoline(ctx, tramp) {
        ctx.save();
        const squish = tramp.squish || 0;
        const curH = tramp.h * (1 - squish * 0.5);
        const curW = tramp.w * (1 + squish * 0.3);

        ctx.translate(tramp.x + tramp.w / 2, tramp.y + tramp.h);
        ctx.beginPath();
        ctx.ellipse(0, -curH / 2, curW / 2, curH / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = tramp.color;
        ctx.shadowColor = tramp.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Shiny Jelly Highlight
        ctx.beginPath();
        ctx.ellipse(-curW * 0.15, -curH * 0.65, curW * 0.2, curH * 0.2, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
        ctx.restore();
    }

    // Render rotating golden collectible stars
    drawStar(ctx, star, time) {
        if (star.collected) return;
        ctx.save();
        const floatY = Math.sin(time * 4 + star.x) * 4;
        ctx.translate(star.x, star.y + floatY);
        ctx.rotate(time * 2);

        // Star glow
        ctx.shadowColor = '#FFEA00';
        ctx.shadowBlur = 14;
        window.particles.drawStarShape(ctx, 0, 0, 5, 14, 7, '#FFD700');

        // Center shine
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
    }

    // Render magical golden key
    drawKey(ctx, key, time) {
        if (key.collected) return;
        ctx.save();
        const floatY = Math.sin(time * 3 + key.x) * 5;
        ctx.translate(key.x, key.y + floatY);
        ctx.rotate(Math.sin(time * 2) * 0.2);

        // Golden Key Shape
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -6, 8, 0, Math.PI * 2);
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 16);
        ctx.lineTo(6, 16);
        ctx.moveTo(0, 11);
        ctx.lineTo(4, 11);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -6, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8E1';
        ctx.fill();
        ctx.restore();
    }

    // Render friend's cage
    drawCage(ctx, cage, time) {
        ctx.save();
        ctx.translate(cage.x, cage.y);

        if (!cage.freed) {
            // Draw Trapped Pet inside looking cute
            ctx.save();
            ctx.translate(0, 8);
            window.characters.drawCompanion(ctx, { x: 0, y: 0, kind: cage.petKind, facing: 1 }, 0);
            ctx.restore();

            // Sparkling Magic Cage Bars
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#00E5FF';
            ctx.shadowColor = '#00E5FF';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(-22, -24, 44, 48, 12);
            ctx.stroke();

            // Vertical bars
            for (let bx = -14; bx <= 14; bx += 9) {
                ctx.beginPath();
                ctx.moveTo(bx, -22);
                ctx.lineTo(bx, 22);
                ctx.stroke();
            }

            // Big Heart Lock in center
            ctx.shadowBlur = 0;
            window.particles.drawHeartShape(ctx, 0, -4, 12, '#FF1744');
            // Keyhole
            ctx.beginPath();
            ctx.arc(0, 2, 2.5, 0, Math.PI * 2);
            ctx.rect(-1.2, 2, 2.4, 4);
            ctx.fillStyle = '#FFD700';
            ctx.fill();
        } else {
            // Shattered open cage sparkles
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = '#B2EBF2';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-22, -24, 44, 48, 12);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Render Checkpoint Flag
    drawCheckpoint(ctx, cp) {
        ctx.save();
        ctx.translate(cp.x, cp.y);

        // Flag Pole
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#78909C';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50);
        ctx.stroke();

        // Flag Banner
        ctx.beginPath();
        const wave = Math.sin(Date.now() * 0.008) * 4;
        ctx.moveTo(0, -50);
        ctx.quadraticCurveTo(18, -42 + wave, 32, -40);
        ctx.lineTo(0, -28);
        ctx.closePath();
        ctx.fillStyle = cp.active ? '#00E676' : '#FF5252';
        ctx.fill();

        // Star on Flag if active
        if (cp.active) {
            window.particles.drawStarShape(ctx, 12, -40, 5, 5, 2.5, '#FFEA00');
        }
        ctx.restore();
    }

    // Render Goal Portal / Carousel
    drawGoal(ctx, goal, time) {
        ctx.save();
        const gx = goal.x + goal.w / 2;
        const gy = goal.y + goal.h / 2;
        ctx.translate(gx, gy);

        // Rotating Rainbow Ring Portal
        const pulse = Math.sin(time * 4) * 0.08 + 1;
        ctx.scale(pulse, pulse);

        for (let r = 40; r >= 15; r -= 8) {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.lineWidth = 6;
            ctx.strokeStyle = r % 16 === 0 ? '#FF4081' : '#00E5FF';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 16;
            ctx.stroke();
        }

        // Giant Golden Spinning Finish Star
        ctx.rotate(time * 1.5);
        window.particles.drawStarShape(ctx, 0, 0, 5, 22, 11, '#FFD700');

        ctx.restore();
    }
}

window.levelManager = new LevelManager();
