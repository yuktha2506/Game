class ParticleSystem {
    constructor() {
        this.particles = [];
        this.confettiColors = ['#FF4081', '#FFD700', '#00E676', '#00B0FF', '#E040FB', '#FF9100'];
        this.rainbowColors = ['#FF1744', '#FF9100', '#FFEA00', '#00E676', '#00E5FF', '#D500F9'];
    }

    reset() {
        this.particles = [];
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += (p.gravity || 0) * dt;
            p.rotation += (p.vRot || 0) * dt;
            if (p.scaleDecay) {
                p.scale = Math.max(0, p.scale - p.scaleDecay * dt);
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        ctx.save();
        for (const p of this.particles) {
            const sx = p.x - cameraX;
            const sy = p.y - cameraY;

            // Simple viewport culling
            if (sx < -60 || sx > ctx.canvas.width + 60 || sy < -60 || sy > ctx.canvas.height + 60) {
                continue;
            }

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(p.rotation);
            ctx.scale(p.scale, p.scale);
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));

            if (p.type === 'confetti') {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.type === 'star') {
                this.drawStarShape(ctx, 0, 0, 5, p.size, p.size * 0.45, p.color);
            } else if (p.type === 'heart') {
                this.drawHeartShape(ctx, 0, 0, p.size, p.color);
            } else if (p.type === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            } else if (p.type === 'ring') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            ctx.restore();
        }
        ctx.restore();
    }

    drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawHeartShape(ctx, x, y, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
            -size / 2, -size / 2,
            -size, topCurveHeight / 3,
            0, size
        );
        // top right curve
        ctx.bezierCurveTo(
            size, topCurveHeight / 3,
            size / 2, -size / 2,
            0, topCurveHeight
        );
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    // Sparkle burst when star is collected
    spawnStarBurst(x, y) {
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 / 16) * i + Math.random() * 0.2;
            const speed = 120 + Math.random() * 180;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 40,
                gravity: 120,
                type: Math.random() > 0.4 ? 'star' : 'circle',
                size: 8 + Math.random() * 8,
                color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
                life: 0.7 + Math.random() * 0.3,
                maxLife: 1.0,
                rotation: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 8,
                scale: 1,
                scaleDecay: 0.5
            });
        }

        // Golden expanding ring
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            type: 'ring',
            size: 6,
            color: '#FFEA00',
            life: 0.4,
            maxLife: 0.4,
            scale: 1,
            scaleDecay: -5.0, // expands outward
            rotation: 0,
            vRot: 0
        });
    }

    // Rainbow dash trail behind player
    spawnRainbowDash(x, y, dir) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x - dir * (i * 6),
                y: y + (Math.random() - 0.5) * 12,
                vx: -dir * (40 + Math.random() * 60),
                vy: (Math.random() - 0.5) * 40,
                gravity: -20,
                type: 'circle',
                size: 9 - i * 0.8,
                color: this.rainbowColors[i % this.rainbowColors.length],
                life: 0.35 + i * 0.04,
                maxLife: 0.5,
                scale: 1,
                scaleDecay: 1.8,
                rotation: 0,
                vRot: 0
            });
        }
    }

    // Fluffy cloud jump / landing dust
    spawnDust(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * 1.5;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: (Math.random() - 0.5) * 120,
                vy: -Math.random() * 50 - 20,
                gravity: 80,
                type: 'circle',
                size: 6 + Math.random() * 6,
                color: 'rgba(255, 255, 255, 0.85)',
                life: 0.35 + Math.random() * 0.2,
                maxLife: 0.55,
                scale: 1,
                scaleDecay: 1.2,
                rotation: 0,
                vRot: 0
            });
        }
    }

    // Heart shower when rescuing pet friends
    spawnHearts(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
            const speed = 100 + Math.random() * 140;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 70,
                type: 'heart',
                size: 10 + Math.random() * 8,
                color: Math.random() > 0.5 ? '#FF4081' : '#FF80AB',
                life: 0.9 + Math.random() * 0.4,
                maxLife: 1.3,
                scale: 1,
                scaleDecay: 0.3,
                rotation: (Math.random() - 0.5) * 0.5,
                vRot: (Math.random() - 0.5) * 2
            });
        }
    }

    // Massive confetti celebration on level completion!
    spawnConfetti(canvasWidth, canvasHeight, count = 90) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * canvasWidth,
                y: -20 - Math.random() * 150,
                vx: (Math.random() - 0.5) * 160,
                vy: 80 + Math.random() * 150,
                gravity: 20,
                type: 'confetti',
                size: 10 + Math.random() * 8,
                color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
                life: 2.5 + Math.random() * 1.5,
                maxLife: 4.0,
                scale: 1,
                scaleDecay: 0.1,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 10
            });
        }
    }
}

window.particles = new ParticleSystem();
