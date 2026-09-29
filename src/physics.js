// Physics, Controls, and Player Controller for Star Friends
// Designed for juicy, forgiving, and delightful platforming!

class PhysicsEngine {
    constructor() {
        this.gravity = 1450;
        this.maxFallSpeed = 750;
        this.runSpeed = 310;
        this.accel = 1800;
        this.friction = 1600;
        this.airFriction = 600;
        this.jumpForce = -560;

        // Forgiving timers (seconds)
        this.coyoteTimeMax = 0.15;
        this.jumpBufferMax = 0.15;
    }

    createPlayer(spawn) {
        return {
            x: spawn.x,
            y: spawn.y,
            vx: 0,
            vy: 0,
            w: 32,
            h: 34,
            facing: 1, // 1 for right, -1 for left
            isGrounded: false,
            canDoubleJump: true,
            isGliding: false,
            isDashing: false,
            dashTimer: 0,
            dashCooldown: 0,

            // Juice & squash
            squashX: 1,
            squashY: 1,
            animTimer: 0,
            blinkTimer: 3,

            // Forgiveness
            coyoteTimer: 0,
            jumpBuffer: 0,

            // Customization
            type: 'bunny', // 'bunny', 'cat', 'dragon'
            color: 'pink',
            hat: 'party',

            // Checkpoints
            respawnX: spawn.x,
            respawnY: spawn.y,
            isRespawning: false,
            respawnAlpha: 1,

            // Rescued Companions trailing behind
            companions: []
        };
    }

    update(player, keys, level, dt) {
        if (player.isRespawning) {
            // Gentle bubble float back to checkpoint
            const dx = player.respawnX - player.x;
            const dy = player.respawnY - player.y;
            player.x += dx * 6 * dt;
            player.y += dy * 6 * dt;
            player.vx = 0;
            player.vy = 0;

            if (Math.hypot(dx, dy) < 8) {
                player.x = player.respawnX;
                player.y = player.respawnY;
                player.isRespawning = false;
                window.particles.spawnDust(player.x, player.y + 16, 12);
            }
            return;
        }

        player.animTimer += dt;

        // Blinking logic
        player.blinkTimer -= dt;
        if (player.blinkTimer <= 0) {
            player.blinkTimer = 2.5 + Math.random() * 3.5;
        }

        // Squash & stretch recovery back to 1.0
        player.squashX += (1 - player.squashX) * 12 * dt;
        player.squashY += (1 - player.squashY) * 12 * dt;

        // Dash cooldown
        if (player.dashCooldown > 0) player.dashCooldown -= dt;

        // Input buffering
        if (keys.jumpPressed) {
            player.jumpBuffer = this.jumpBufferMax;
            keys.jumpPressed = false;
        } else if (player.jumpBuffer > 0) {
            player.jumpBuffer -= dt;
        }

        if (player.isGrounded) {
            player.coyoteTimer = this.coyoteTimeMax;
            player.canDoubleJump = true;
            player.isGliding = false;
        } else {
            player.coyoteTimer -= dt;
        }

        // Handle Horizontal Movement
        let moveDir = 0;
        if (keys.left) moveDir -= 1;
        if (keys.right) moveDir += 1;

        if (moveDir !== 0) {
            player.facing = moveDir;
        }

        // Dash ability (special for Mochi the Cat or all heroes with Shift/Dash key)
        if (keys.dash && player.dashCooldown <= 0 && !player.isDashing) {
            player.isDashing = true;
            player.dashTimer = 0.22;
            player.dashCooldown = 0.65;
            player.vx = player.facing * (player.type === 'cat' ? 620 : 520);
            player.vy = 0;
            window.sound.playDash();
            window.particles.spawnRainbowDash(player.x, player.y, player.facing);
        }

        if (player.isDashing) {
            player.dashTimer -= dt;
            window.particles.spawnRainbowDash(player.x, player.y, player.facing);
            if (player.dashTimer <= 0) {
                player.isDashing = false;
            }
        } else {
            // Normal Horizontal Acceleration & Friction
            const targetSpeed = moveDir * this.runSpeed;
            const currentAccel = player.isGrounded ? this.accel : (this.accel * 0.7);

            if (moveDir !== 0) {
                if (player.vx < targetSpeed) {
                    player.vx = Math.min(targetSpeed, player.vx + currentAccel * dt);
                } else if (player.vx > targetSpeed) {
                    player.vx = Math.max(targetSpeed, player.vx - currentAccel * dt);
                }
            } else {
                const curFriction = player.isGrounded ? this.friction : this.airFriction;
                if (player.vx > 0) {
                    player.vx = Math.max(0, player.vx - curFriction * dt);
                } else if (player.vx < 0) {
                    player.vx = Math.min(0, player.vx + curFriction * dt);
                }
            }
        }

        // Jump Execution
        if (player.jumpBuffer > 0) {
            if (player.coyoteTimer > 0) {
                // First Jump from ground
                this.executeJump(player, false);
                player.jumpBuffer = 0;
                player.coyoteTimer = 0;
            } else if (player.canDoubleJump) {
                // Mid-air Double Jump
                this.executeJump(player, true);
                player.canDoubleJump = false;
                player.jumpBuffer = 0;
            }
        }

        // Variable Jump Height (cutting jump early if released)
        if (!keys.jump && player.vy < -200 && !player.isGliding) {
            player.vy += 800 * dt;
        }

        // Dragon Flutter / Glide
        if (player.type === 'dragon' && keys.jump && player.vy > 60 && !player.isGrounded) {
            player.isGliding = true;
            player.vy = 90; // Gentle float
        } else {
            player.isGliding = false;
        }

        // Gravity
        if (!player.isDashing && !player.isGliding) {
            player.vy = Math.min(this.maxFallSpeed, player.vy + this.gravity * dt);
        }

        // Update Moving Platforms
        for (const plat of level.platforms) {
            if (plat.type === 'moving') {
                if (plat.vx) {
                    plat.x += plat.vx * dt;
                    if (plat.x < plat.minX) {
                        plat.x = plat.minX;
                        plat.vx = Math.abs(plat.vx);
                    } else if (plat.x > plat.maxX) {
                        plat.x = plat.maxX;
                        plat.vx = -Math.abs(plat.vx);
                    }
                }
                if (plat.vy) {
                    plat.y += plat.vy * dt;
                    if (plat.y < plat.minY) {
                        plat.y = plat.minY;
                        plat.vy = Math.abs(plat.vy);
                    } else if (plat.y > plat.maxY) {
                        plat.y = plat.maxY;
                        plat.vy = -Math.abs(plat.vy);
                    }
                }
            }
        }

        // Update Trampoline Squish animations
        for (const tramp of level.trampolines) {
            if (tramp.squish > 0) {
                tramp.squish = Math.max(0, tramp.squish - 4 * dt);
            }
        }

        // Move Player & Check Collisions
        this.resolveCollisions(player, level, dt);

        // Check Trampoline Bouncing
        this.checkTrampolines(player, level);

        // Check Bottom Boundary (Falling in pit -> gentle bubble rescue!)
        if (player.y > level.height + 60) {
            player.isRespawning = true;
            window.particles.spawnHearts(player.respawnX, player.respawnY, 8);
        }

        // Update Companion Parade positions (Smooth spring trail)
        this.updateCompanions(player, dt);
    }

    executeJump(player, isDouble) {
        let force = this.jumpForce;
        if (player.type === 'bunny') {
            force = isDouble ? -620 : -580; // Bunny hops higher!
        }

        player.vy = force;
        player.squashX = 0.75;
        player.squashY = 1.35; // Stretch upward
        player.isGrounded = false;

        if (isDouble) {
            window.sound.playDoubleJump();
            window.particles.spawnDust(player.x, player.y + 12, 8);
        } else {
            window.sound.playJump();
            window.particles.spawnDust(player.x, player.y + 16, 6);
        }
    }

    resolveCollisions(player, level, dt) {
        const prevGrounded = player.isGrounded;

        // Move X
        player.x += player.vx * dt;
        player.x = Math.max(16, Math.min(level.width - 16, player.x));

        // Move Y
        player.y += player.vy * dt;
        player.isGrounded = false;

        const pBox = {
            left: player.x - player.w / 2,
            right: player.x + player.w / 2,
            top: player.y - player.h / 2,
            bottom: player.y + player.h / 2
        };

        for (const plat of level.platforms) {
            // Check bounding box intersection
            if (
                pBox.right > plat.x &&
                pBox.left < plat.x + plat.w &&
                pBox.bottom >= plat.y &&
                pBox.top < plat.y + plat.h
            ) {
                // Landing on top of platform (one-way or solid)
                if (player.vy >= 0 && (pBox.bottom - player.vy * dt) <= plat.y + 12) {
                    player.y = plat.y - player.h / 2;
                    player.vy = 0;
                    player.isGrounded = true;

                    // Stick to moving platform
                    if (plat.type === 'moving' && plat.vx) {
                        player.x += plat.vx * dt;
                    }

                    // Landing squash juice!
                    if (!prevGrounded) {
                        player.squashX = 1.3;
                        player.squashY = 0.75;
                        window.particles.spawnDust(player.x, player.y + 16, 6);
                    }
                    break;
                }
            }
        }
    }

    checkTrampolines(player, level) {
        const feetY = player.y + player.h / 2;
        for (const tramp of level.trampolines) {
            if (
                player.x > tramp.x &&
                player.x < tramp.x + tramp.w &&
                feetY >= tramp.y - 4 &&
                feetY <= tramp.y + tramp.h &&
                player.vy >= 0
            ) {
                player.vy = tramp.power;
                player.squashX = 0.65;
                player.squashY = 1.45;
                tramp.squish = 1.0;
                player.isGrounded = false;
                player.canDoubleJump = true;
                window.sound.playBounce();
                window.particles.spawnStarBurst(tramp.x + tramp.w / 2, tramp.y);
                break;
            }
        }
    }

    updateCompanions(player, dt) {
        let prevTarget = { x: player.x - player.facing * 28, y: player.y };

        for (let i = 0; i < player.companions.length; i++) {
            const pet = player.companions[i];
            const dist = Math.hypot(prevTarget.x - pet.x, prevTarget.y - pet.y);

            if (dist > 15) {
                pet.x += (prevTarget.x - pet.x) * 8 * dt;
                pet.y += (prevTarget.y - pet.y) * 8 * dt;
                pet.facing = prevTarget.x > pet.x ? 1 : -1;
            }

            prevTarget = { x: pet.x - pet.facing * 24, y: pet.y };
        }
    }
}

window.physics = new PhysicsEngine();
