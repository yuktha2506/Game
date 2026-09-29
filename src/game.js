// Main Game Controller, Camera, State Manager, and Event Loop for Star Friends

class StarFriendsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.state = 'MENU'; // 'MENU', 'PLAY', 'CUSTOMIZE', 'PAUSE', 'VICTORY', 'TROPHY'
        this.currentLevelIndex = 0;
        this.level = null;
        this.player = null;

        // Camera
        this.camera = { x: 0, y: 0 };

        // Game stats & progress (stored in localStorage)
        this.stats = this.loadStats();

        // Level run stats
        this.levelStarsCollected = 0;
        this.hasLevelKey = false;
        this.rescuedPetThisLevel = false;

        // Input state
        this.keys = {
            left: false,
            right: false,
            jump: false,
            jumpPressed: false,
            dash: false
        };

        // Canvas roundRect fallback for older browser engines
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h) {
                this.rect(x, y, w, h);
            };
        }

        this.lastTime = 0;
        this.previewAnimationId = null;
        this.setupEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialize first level & player
        this.initLevel(0);

        // Start animation frame loop
        requestAnimationFrame((t) => this.loop(t));
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('star_friends_save');
            if (saved) return JSON.parse(saved);
        } catch (e) {}

        return {
            totalStars: 0,
            unlockedLevels: 1,
            character: 'bunny',
            color: 'pink',
            hat: 'party',
            stickers: ['first_hero'],
            trophies: []
        };
    }

    saveStats() {
        try {
            localStorage.setItem('star_friends_save', JSON.stringify(this.stats));
        } catch (e) {}
        this.updateHUD();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.displayWidth = rect.width || window.innerWidth || 800;
        this.displayHeight = rect.height || window.innerHeight || 600;
        this.canvas.width = this.displayWidth * dpr;
        this.canvas.height = this.displayHeight * dpr;
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
    }

    initLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        this.level = window.levelManager.getLevel(levelIndex);
        this.player = window.physics.createPlayer(this.level.spawn);

        // Apply saved character customizations
        this.player.type = this.stats.character;
        this.player.color = this.stats.color;
        this.player.hat = this.stats.hat;

        this.levelStarsCollected = 0;
        this.hasLevelKey = false;
        this.rescuedPetThisLevel = false;
        window.particles.reset();

        // Update Camera
        this.camera.x = this.player.x - this.displayWidth / 2;
        this.camera.y = this.player.y - this.displayHeight / 2;

        this.updateHUD();
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') this.keys.right = true;
            if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key === ' ') {
                if (!this.keys.jump) this.keys.jumpPressed = true;
                this.keys.jump = true;
            }
            if (e.key === 'Shift' || e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'c') {
                this.keys.dash = true;
            }

            if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
                if (this.state === 'PLAY') this.setState('PAUSE');
                else if (this.state === 'PAUSE') this.setState('PLAY');
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') this.keys.right = false;
            if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key === ' ') this.keys.jump = false;
            if (e.key === 'Shift' || e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'c') this.keys.dash = false;
        });

        // Touch / On-Screen Controls
        const btnLeft = document.getElementById('touchLeft');
        const btnRight = document.getElementById('touchRight');
        const btnJump = document.getElementById('touchJump');
        const btnDash = document.getElementById('touchDash');

        const bindTouch = (btn, onPress, onRelease) => {
            if (!btn) return;
            const start = (e) => { e.preventDefault(); onPress(); };
            const end = (e) => { e.preventDefault(); onRelease(); };
            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
        };

        bindTouch(btnLeft, () => this.keys.left = true, () => this.keys.left = false);
        bindTouch(btnRight, () => this.keys.right = true, () => this.keys.right = false);
        bindTouch(btnJump, () => {
            if (!this.keys.jump) this.keys.jumpPressed = true;
            this.keys.jump = true;
        }, () => this.keys.jump = false);
        bindTouch(btnDash, () => this.keys.dash = true, () => this.keys.dash = false);
    }

    setState(newState) {
        this.state = newState;

        // Hide all modal overlays
        document.querySelectorAll('.screen-overlay').forEach(el => el.classList.add('hidden'));

        if (this.previewAnimationId) {
            cancelAnimationFrame(this.previewAnimationId);
            this.previewAnimationId = null;
        }

        if (newState === 'MENU') {
            document.getElementById('screenMenu').classList.remove('hidden');
            window.sound.stopBGM();
        } else if (newState === 'CUSTOMIZE') {
            document.getElementById('screenCustomize').classList.remove('hidden');
            this.startPreviewLoop();
        } else if (newState === 'PAUSE') {
            document.getElementById('screenPause').classList.remove('hidden');
        } else if (newState === 'VICTORY') {
            document.getElementById('screenVictory').classList.remove('hidden');
            this.showVictoryScreen();
        } else if (newState === 'TROPHY') {
            document.getElementById('screenTrophy').classList.remove('hidden');
            this.refreshTrophyUI();
        } else if (newState === 'PLAY') {
            window.sound.startBGM();
        }

        this.updateHUD();
    }

    startGame() {
        this.initLevel(this.currentLevelIndex);
        this.setState('PLAY');
    }

    update(dt) {
        if (this.state !== 'PLAY') return;

        // Update Physics & Player
        window.physics.update(this.player, this.keys, this.level, dt);

        // Update Particles
        window.particles.update(dt);

        // Check Star Collectibles
        for (const star of this.level.stars) {
            if (!star.collected) {
                const dist = Math.hypot(this.player.x - star.x, this.player.y - star.y);
                if (dist < 26) {
                    star.collected = true;
                    this.levelStarsCollected++;
                    this.stats.totalStars++;
                    window.sound.playStar();
                    window.particles.spawnStarBurst(star.x, star.y);
                    this.updateHUD();
                }
            }
        }

        // Check Golden Key Collectible
        if (this.level.key && !this.level.key.collected) {
            const dist = Math.hypot(this.player.x - this.level.key.x, this.player.y - this.level.key.y);
            if (dist < 28) {
                this.level.key.collected = true;
                this.hasLevelKey = true;
                window.sound.playStar();
                window.particles.spawnStarBurst(this.level.key.x, this.level.key.y);
                this.updateHUD();
            }
        }

        // Check Baby Pet Cage Unlock
        if (this.level.cage && !this.level.cage.freed) {
            const dist = Math.hypot(this.player.x - this.level.cage.x, this.player.y - this.level.cage.y);
            if (dist < 42 && this.hasLevelKey) {
                this.level.cage.freed = true;
                this.rescuedPetThisLevel = true;
                window.sound.playRescue();
                window.particles.spawnHearts(this.level.cage.x, this.level.cage.y, 20);

                // Add pet to player's parade
                this.player.companions.push({
                    x: this.level.cage.x,
                    y: this.level.cage.y,
                    kind: this.level.cage.petKind,
                    name: this.level.cage.petName,
                    facing: 1
                });

                // Award sticker
                if (!this.stats.stickers.includes(this.level.cage.petKind)) {
                    this.stats.stickers.push(this.level.cage.petKind);
                }
                this.saveStats();
                this.updateHUD();
            }
        }

        // Check Checkpoint
        if (this.level.checkpoint && !this.level.checkpoint.active) {
            const dist = Math.hypot(this.player.x - this.level.checkpoint.x, this.player.y - this.level.checkpoint.y);
            if (dist < 35) {
                this.level.checkpoint.active = true;
                this.player.respawnX = this.level.checkpoint.x;
                this.player.respawnY = this.level.checkpoint.y - 20;
                window.sound.playCheckpoint();
                window.particles.spawnStarBurst(this.level.checkpoint.x, this.level.checkpoint.y - 30);
            }
        }

        // Check Goal
        const goal = this.level.goal;
        if (
            this.player.x > goal.x &&
            this.player.x < goal.x + goal.w &&
            this.player.y > goal.y &&
            this.player.y < goal.y + goal.h
        ) {
            this.triggerLevelVictory();
        }

        // Smooth Camera Follow with lookahead
        const targetCamX = this.player.x - this.displayWidth / 2 + this.player.facing * 80;
        const targetCamY = this.player.y - this.displayHeight / 2 - 20;

        this.camera.x += (targetCamX - this.camera.x) * 4.5 * dt;
        this.camera.y += (targetCamY - this.camera.y) * 4.5 * dt;

        // Clamp camera to level edges
        this.camera.x = Math.max(0, Math.min(this.level.width - this.displayWidth, this.camera.x));
        this.camera.y = Math.max(0, Math.min(this.level.height - this.displayHeight, this.camera.y));
    }

    triggerLevelVictory() {
        window.sound.stopBGM();
        window.sound.playVictory();
        window.particles.spawnConfetti(this.displayWidth, this.displayHeight, 100);

        // Unlock next level
        if (this.currentLevelIndex + 1 >= this.stats.unlockedLevels) {
            this.stats.unlockedLevels = Math.min(3, this.currentLevelIndex + 2);
        }

        // Save progress
        this.saveStats();
        setTimeout(() => {
            this.setState('VICTORY');
        }, 600);
    }

    showVictoryScreen() {
        const titleEl = document.getElementById('victoryTitle');
        const starsEl = document.getElementById('victoryStarsCount');
        const friendEl = document.getElementById('victoryFriendText');

        if (titleEl) titleEl.innerText = `${this.level.name} Cleared! 🎉`;
        if (starsEl) starsEl.innerText = `⭐ Stars Collected: ${this.levelStarsCollected}`;
        if (friendEl) {
            if (this.rescuedPetThisLevel) {
                friendEl.innerText = `💖 Rescued Friend: ${this.level.cage.petName}!`;
                friendEl.style.display = 'block';
            } else {
                friendEl.style.display = 'none';
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        const time = Date.now() * 0.001;

        ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

        if (!this.level) return;

        // 1. Draw Parallax Background
        window.levelManager.drawBackground(ctx, this.level, this.camera.x, this.camera.y, time);

        // 2. Draw World Objects (translated by camera)
        ctx.save();
        ctx.translate(-this.camera.x, -this.camera.y);

        // Platforms
        for (const plat of this.level.platforms) {
            window.levelManager.drawPlatform(ctx, plat);
        }

        // Trampolines
        for (const tramp of this.level.trampolines) {
            window.levelManager.drawTrampoline(ctx, tramp);
        }

        // Collectible Stars
        for (const star of this.level.stars) {
            window.levelManager.drawStar(ctx, star, time);
        }

        // Key
        if (this.level.key) {
            window.levelManager.drawKey(ctx, this.level.key, time);
        }

        // Checkpoint
        if (this.level.checkpoint) {
            window.levelManager.drawCheckpoint(ctx, this.level.checkpoint);
        }

        // Cage & Friend
        if (this.level.cage) {
            window.levelManager.drawCage(ctx, this.level.cage, time);
        }

        // Goal Portal
        window.levelManager.drawGoal(ctx, this.level.goal, time);

        // Baby Companions Parade
        for (let i = 0; i < this.player.companions.length; i++) {
            window.characters.drawCompanion(ctx, this.player.companions[i], i);
        }

        // Player Character
        window.characters.draw(ctx, this.player);

        // Respawn fairy bubble indicator
        if (this.player.isRespawning) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.player.x, this.player.y, 26, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(128, 222, 234, 0.4)';
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 2.5;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();

        // 3. Draw Particles (Screenspace or Camera Space)
        window.particles.draw(ctx, this.camera.x, this.camera.y);
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }

    updateHUD() {
        const starCountEl = document.getElementById('hudStars');
        const keyIndicatorEl = document.getElementById('hudKey');
        const companionsEl = document.getElementById('hudCompanions');

        if (starCountEl) starCountEl.innerText = this.stats.totalStars;
        if (keyIndicatorEl) {
            keyIndicatorEl.style.display = this.hasLevelKey ? 'inline-block' : 'none';
        }
        if (companionsEl) {
            companionsEl.innerText = '💖 ' + (this.player ? this.player.companions.length : 0);
        }
    }

    // Customizer UI handlers
    selectHero(heroType) {
        this.stats.character = heroType;
        if (this.player) this.player.type = heroType;
        this.saveStats();
        this.refreshCustomizerUI();
    }

    selectColor(col) {
        this.stats.color = col;
        if (this.player) this.player.color = col;
        this.saveStats();
        this.refreshCustomizerUI();
    }

    selectHat(hat) {
        this.stats.hat = hat;
        if (this.player) this.player.hat = hat;
        this.saveStats();
        this.refreshCustomizerUI();
    }

    startPreviewLoop() {
        this.refreshCustomizerUI();
        const loop = () => {
            if (this.state !== 'CUSTOMIZE') return;
            this.drawPreviewFrame();
            this.previewAnimationId = requestAnimationFrame(loop);
        };
        loop();
    }

    drawPreviewFrame() {
        const previewCanvas = document.getElementById('charPreviewCanvas');
        if (previewCanvas) {
            const pctx = previewCanvas.getContext('2d');
            pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            const now = Date.now() * 0.001;
            const dummy = {
                x: previewCanvas.width / 2,
                y: previewCanvas.height / 2 + 10,
                facing: 1,
                squashX: 1 + Math.sin(now * 4) * 0.05,
                squashY: 1 - Math.sin(now * 4) * 0.05,
                animTimer: now * 2,
                blinkTimer: (now % 4 < 0.15) ? 0.05 : 2,
                isGrounded: true,
                vx: 0,
                vy: 0,
                type: this.stats.character,
                color: this.stats.color,
                hat: this.stats.hat
            };
            window.characters.draw(pctx, dummy);
        }
    }

    refreshCustomizerUI() {
        document.querySelectorAll('.char-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.hero === this.stats.character);
        });
        document.querySelectorAll('.color-dot').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === this.stats.color);
        });
        document.querySelectorAll('.hat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.hat === this.stats.hat);
        });
        this.drawPreviewFrame();
    }

    refreshTrophyUI() {
        const grid = document.getElementById('trophyGrid');
        if (!grid) return;

        const allStickers = [
            { id: 'first_hero', name: 'Brave Adventurer', icon: '🌟', desc: 'Started your magical quest!' },
            { id: 'bunny', name: 'Baby Barnaby', icon: '🐰', desc: 'Rescued Baby Barnaby in Candy Meadow!' },
            { id: 'chick', name: 'Pippin the Chick', icon: '🐥', desc: 'Rescued Pippin in Cloud Kingdom!' },
            { id: 'star', name: 'Stella the Star', icon: '⭐', desc: 'Rescued Stella in Cosmic Cove!' },
            { id: 'collector', name: 'Star Master', icon: '👑', desc: 'Gathered 20 or more golden stars!' }
        ];

        if (this.stats.totalStars >= 20 && !this.stats.stickers.includes('collector')) {
            this.stats.stickers.push('collector');
            this.saveStats();
        }

        grid.innerHTML = allStickers.map(st => {
            const unlocked = this.stats.stickers.includes(st.id);
            return `
                <div class="trophy-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="trophy-icon">${unlocked ? st.icon : '❓'}</div>
                    <div class="trophy-title">${unlocked ? st.name : 'Mystery Sticker'}</div>
                    <div class="trophy-desc">${unlocked ? st.desc : 'Keep playing to discover!'}</div>
                </div>
            `;
        }).join('');
    }
}

// Global game instance initialization
window.addEventListener('DOMContentLoaded', () => {
    window.game = new StarFriendsGame();
});
