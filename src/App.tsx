import { useEffect, useRef, useState } from "react";
import "./App.css";
import Mapper from "./Mapper";
export interface Coords {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface ImageMap {
	image: string;
	coords: Coords[];
}

function App() {
	const [fileContent, setFileContent] = useState<string | null>(null);
	const [originalImage, setOribinalImage] = useState<HTMLImageElement | null>(
		null
	);
	const [isDrawing, setIsDrawing] = useState(false);
	const [coors, setCoors] = useState({ x: 0, y: 0 });

	const [imageMap, setImageMap] = useState<ImageMap>({
		image: "",
		coords: [],
	});

	const setImgMap = (image: string) =>
		setImageMap((prev) => ({ ...prev, image }));

	const setCoords = (coords: Coords) =>
		setImageMap((prev) => ({ ...prev, coords: [...prev.coords, coords] }));

	const canvaRef = useRef<HTMLCanvasElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const tableImage = event.target.files?.[0];
		if (tableImage) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setFileContent(e.target?.result as string);
				const url = e.target?.result as string;
				setImgMap(url);
			};
			reader.readAsDataURL(tableImage);
		}
	};
	const getMousePositionOnCanva = (
		event: React.MouseEvent<HTMLCanvasElement>
	) => {
		const canvas = canvaRef.current;
		if (!canvas) return { x: 0, y: 0 };

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		return { x, y };
	};

	const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!fileContent || canvaRef.current == null) return;
		setIsDrawing(true);

		// Get the current position of the mouse
		const { x, y } = getMousePositionOnCanva(event);

		const width = canvaRef.current.width;
		const height = canvaRef.current.height;
		console.log("ONDOWN", { x, y });

		setCoors({ x, y });
	};
	const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing || canvaRef.current == null) return;

		const canvasRef = canvaRef.current;

		const { x: currentX, y: currentY } = getMousePositionOnCanva(event);

		const width = currentX - coors.x;
		const height = currentY - coors.y;
		const ctx = canvasRef.getContext("2d");

		ctx?.fillRect(coors.x, coors.y, width, height);
	};

	const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing || canvaRef.current == null) return;
		const { x, y } = getMousePositionOnCanva(event);

		const newCoords = {
			x1: coors.x,
			y1: coors.y,
			x2: x,
			y2: y,
		};

		setCoords(newCoords);
		setIsDrawing(false);
	};
	const onFinish = () => {
		localStorage.setItem("imageMap", JSON.stringify(imageMap));
	};

	useEffect(() => {
		if (!fileContent || canvaRef.current == null) return;

		const canvas = canvaRef.current;
		const ctx = canvas?.getContext("2d");

		const image = new Image();
		image.crossOrigin = "anonymous";
		image.src = fileContent;
		setOribinalImage(image);
		image.onload = () => {
			canvas.width = image.width;
			canvas.height = image.height;
			ctx?.drawImage(image, 0, 0, image.width, image.height);
		};
	}, [fileContent]);

	return (
		<section className="app">
			<h1 className="app__title">Table tac</h1>
			<label className="file" htmlFor="table">
				Select a image table
				<input type="file" name="table" onChange={handleFileChange} />
			</label>
			<div>
				<canvas
					className="canvas"
					ref={canvaRef}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
				/>
			</div>

			{fileContent && <button onClick={onFinish}>Finalizar</button>}
			<Mapper />
		</section>
	);
}

export default App;
