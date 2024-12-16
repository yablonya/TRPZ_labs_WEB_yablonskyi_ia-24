"use client";

import React, {useContext, useEffect, useId, useState} from 'react';
import "./CreateMapDialog.scss";
import {
	FloatingFocusManager,
	FloatingOverlay,
	FloatingPortal,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole
} from "@floating-ui/react";
import {UserContext} from "@/utils/hooks/useAuthentication";
import {useRouter} from "next/navigation";
import {MindMapType} from "@/types/MindMapType";

const CreateMapDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const userContext = useContext(UserContext);
	const [newMap, setNewMap] = React.useState("");
	const [showHelperText, setShowHelperText] = React.useState(false);
	const router = useRouter();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setNewMap(value);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		console.log(`http://localhost:8080/api/mind-map/create?name=${newMap}`)

		try {
			for (let field of Object.values(newMap)) {
				if (field === "") {
					setShowHelperText(true);
					return;
				}
			}
			const res = await fetch(`http://localhost:8080/api/mind-map/create?name=${newMap}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
			});

			if (res.ok) {
				const mindMap: MindMapType = await res.json();
				setNewMap("");
				setIsOpen(false);
				router.push(`/mind-map/${mindMap.id}`);
			} else {
				console.log('Registration error');
			}
		} catch (error) {
			console.error('Network error:', error);
		}
	};

	useEffect(() => {
		setShowHelperText(false)
	}, [newMap]);

	const { refs, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen
	});

	const click = useClick(context);
	const role = useRole(context);
	const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		role,
		dismiss
	]);

	const headingId = useId();
	const descriptionId = useId();

	return (
		<>
			<button ref={refs.setReference} {...getReferenceProps()}>
				Create mind map
			</button>
			<FloatingPortal>
				{isOpen && (
					<FloatingOverlay className="dialog-overlay" lockScroll>
						<FloatingFocusManager context={context}>
							<div
								className="dialog"
								ref={refs.setFloating}
								aria-labelledby={headingId}
								aria-describedby={descriptionId}
								{...getFloatingProps()}
							>
								<h2 id={headingId}>Create mind map</h2>
								<input type="text" placeholder="Enter mind map name..." value={newMap} onChange={handleInputChange} />
								<div className="dialog-controls">
									<button
										onClick={(event) => {
											handleSubmit(event)
											setIsOpen(false);
										}}
									>
										Create
									</button>
									<button onClick={() => setIsOpen(false)}>Cancel</button>
								</div>
							</div>
						</FloatingFocusManager>
					</FloatingOverlay>
				)}
			</FloatingPortal>
		</>
	);
};

export default CreateMapDialog;
