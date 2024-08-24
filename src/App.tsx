import { useEffect, useRef, useState } from "react";
import "./App.css";
interface Drawing {
	x: number;
	y: number;
	width: number;
	height: number;
}

function App() {
	const [fileContent, setFileContent] = useState<string | null>(null);
	const [originalImage, setOribinalImage] = useState<HTMLImageElement | null>(
		null
	);
	const [isDrawing, setIsDrawing] = useState(false);
	const [coors, setCoors] = useState({ x: 0, y: 0 });
	const [drawings, setDrawings] = useState<Drawing[]>([]);

	const canvaRef = useRef<HTMLCanvasElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const tableImage = event.target.files?.[0];
		if (tableImage) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setFileContent(e.target?.result as string);
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

		setDrawings((prevDrawings) => [
			...prevDrawings,
			{ x: coors.x, y: coors.y, width, height },
		]);

		setCoors({ x, y });
	};
	const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDrawing || canvaRef.current == null) return;

		const canvasRef = canvaRef.current;

		const { x: currentX, y: currentY } = getMousePositionOnCanva(event);

		const width = currentX - coors.x;
		const height = currentY - coors.y;

		//clear the canvas
		const ctx = canvasRef.getContext("2d");

		ctx?.fillRect(coors.x, coors.y, width, height);
	};
	const onMouseUp = () => {
		setIsDrawing(false);
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
	console.log({ drawings });
	return (
		<section className="app">
			<h1 className="app__title">Table tac</h1>
			<label className="file" htmlFor="table">
				Select a image table
				<input type="file" name="table" onChange={handleFileChange} />
				<canvas
					className="canvas"
					ref={canvaRef}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
				/>
			</label>
		</section>
	);
}

export default App;
