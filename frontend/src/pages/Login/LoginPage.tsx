import {
	// MoveDirectionAlt,
	// OutModeAlt,
	type Container,
	type ISourceOptions,
} from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { useEffect, useMemo, useRef, useState } from 'react'
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from '@tsparticles/slim'
import BackgroundVideo from '../../assets/person-detection.mp4'
import LoginForm from '../../components/Auth/LoginForm'

const LoginPage = () => {
	const [init, setInit] = useState(false)

	// this should be run only once per application lifetime
	useEffect(() => {
		initParticlesEngine(async (engine) => {
			// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			//await loadAll(engine);
			//await loadFull(engine);
			await loadSlim(engine)
			//await loadBasic(engine);
		}).then(() => {
			setInit(true)
		})
	}, [])

	const particlesLoaded = async (container?: Container): Promise<void> => {
		console.log(container)
	}

	const options: ISourceOptions = useMemo(
		() => ({
			background: {
				opacity: 0.6,
				color: {
					value: '#0000',
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: 'push',
					},
					onHover: {
						enable: true,
						mode: 'repulse',
					},
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 200,
						duration: 0,
					},
				},
			},
			particles: {
				color: {
					value: '#ffff',
				},
				links: {
					color: '#ffff',
					distance: 150,
					enable: true,
					opacity: 0.8,
					width: 1,
				},
				move: {
					direction: 'bottom',
					enable: true,
					outModes: {
						default: 'bounce',
					},
					random: false,
					speed: 2,
					straight: false,
				},
				number: {
					density: {
						enable: true,
					},
					value: 100,
				},
				opacity: {
					value: 0.5,
				},
				shape: {
					type: 'circle',
				},
				size: {
					value: { min: 1, max: 5 },
				},
			},
			detectRetina: true,
		}),
		[]
	)

	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			video.playbackRate = 0.4 // Set playback speed to 0.4x
			video.addEventListener('loadedmetadata', () => {
				video.playbackRate = 0.4 // Ensure playback speed is set after metadata is loaded
			})
		}

		return () => {
			if (video) {
				video.removeEventListener('loadedmetadata', () => {
					video.playbackRate = 0.4
				})
			}
		}
	}, []) // Re-run the effect when videoRef.current changes

	if (init) {
		return (
			<>
				<div className="relative flex justify-center items-center h-screen w-full">
					<div className="z-40">
						<Particles
							id="tsparticles"
							particlesLoaded={particlesLoaded}
							options={options}
						/>
					</div>
					<div className="bg-yellow-500 z-50 absolute">
						<LoginForm />
					</div>
					<div className="w-screen h-screen absolute">
						<video
							src={BackgroundVideo}
							className="h-screen w-screen object-center"
							loop
							autoPlay
							muted
							ref={videoRef}
						></video>
					</div>
				</div>
			</>
		)
	}

	return <div>hello</div>
}

export default LoginPage
