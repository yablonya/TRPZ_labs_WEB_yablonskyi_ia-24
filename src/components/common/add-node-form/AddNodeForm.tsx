import React, {FC, useState } from 'react';

interface AddNodeFormProps {
	mindMapId: number;
	onClose: () => void;
}

const AddNodeForm: FC<AddNodeFormProps> = ({ mindMapId, onClose }) => {
	const [content, setContent] = useState('');
	const [priority, setPriority] = useState<number | null>(null);
	const [category, setCategory] = useState('');
	const [files, setFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files).slice(0, 3);
			setFiles(selectedFiles);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		
		const uploadedUrls: any[] = [];
		for (const file of files) {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			await new Promise((resolve) => {
				reader.onloadend = async () => {
					const res = await fetch('/api/upload', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ data: reader.result }),
					});
					const data = await res.json();
					uploadedUrls.push(data.url);
					resolve(data.url);
				};
			});
		}
		
		const xPosition = window.innerWidth / 2;
		const yPosition = window.innerHeight / 2;
		
		const payload = {
			mindMapId,
			content,
			priority: priority || null,
			category,
			xPosition,
			yPosition,
			files: uploadedUrls,
		};

		try {
			const res = await fetch('http://localhost:8080/api/mind-map/add-node', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				alert('Node added successfully!');
				onClose();
			} else {
				alert('Failed to add node');
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-node-form">
			<h3>Add Node</h3>
			<input
				type="text"
				placeholder="Content"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				required
			/>
			<input
				type="number"
				placeholder="Priority (optional)"
				value={priority || ''}
				onChange={(e) => setPriority(Number(e.target.value))}
			/>
			<input
				type="text"
				placeholder="Category (optional)"
				value={category}
				onChange={(e) => setCategory(e.target.value)}
			/>
			<input type="file" multiple onChange={handleFileChange} />
			<button onClick={handleSubmit} disabled={loading}>
				{loading ? 'Saving...' : 'Save Node'}
			</button>
			<button onClick={onClose}>Cancel</button>
		</div>
	);
};

export default AddNodeForm;
