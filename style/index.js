console.log(gsap)
const canvas = document.
    querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player { /* Criando uma propriedada para o Jogador */
    constructor(x, y, radius, color) { /* toda vez que criar um novo player vai ter novas propriedades */
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw ()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw ()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Particle {
    constructor(x, y, radius, color, velocity) {

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw ()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 10, 'white')
const projectiles = []
const enemies = []
const particles = []


function spawnEnemies() {
    setInterval(() =>{
        const radius = Math.random() * (30 - 10) + 10

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }else{
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

            const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))

        console.log(enemies)
    }, 1000)
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((Particle, index) => {
        if(Particle.alpha <=0 ){
            particles.splice(index, 1)
        }else{
            Particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()

        // remove projeteis fora da tela
        if(
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //end game
        if(dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId)
        }

        projectiles.forEach((Projectile, projectilesIndex) => {
            const dist = Math.hypot(Projectile.x - enemy.x, Projectile.y - enemy.y)

            // creando explosões 
            if(dist - enemy.radius - Projectile.radius < 1){ 
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(
                        new Particle(
                            Projectile.x, 
                            Projectile.y, 
                            Math.random () * 2, 
                            enemy.color,
                            {
                            x: Math.random() -0.5,
                            y: Math.random() -0.5
                            }
                        )
                    )
                }

                if (enemy.radius - 10 > 5){
                    gsap.to(enemy, {
                        radius: enemy.radius -10
                    })
                    setTimeout(() =>{
                        projectiles.splice(projectilesIndex, 1)
                    }, 0)
                }else{
                    setTimeout(() =>{
                        enemies.splice(index, 1)
                        projectiles.splice(projectilesIndex, 1)
                    }, 0)
                }
            }
        })
        });
}


console.log(player)

addEventListener('click', (event) => {
    console.log(projectiles)
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(
        new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            5,
            'white',
            velocity
        )
    )
})

animate()
spawnEnemies()