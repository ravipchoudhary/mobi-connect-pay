import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Button } from "./_ssr/button-DMJo-YE3.mjs";
import { H as Eye, I as Image, U as EyeOff, _ as Settings, g as ShieldCheck, lt as BellRing, u as Trash2, ut as Banknote, w as Plus } from "./_libs/lucide-react.mjs";
import { t as Card } from "./_ssr/card-CzXpCsbD.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { i as addDemoSliderImage, p as getDemoSliderImages, s as deleteDemoSliderImage, x as updateDemoSliderImage, y as toggleDemoSliderImageActive } from "./_ssr/demo-data-CrcRAGHm.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.settings-BZWc7Oe0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [sms, setSms] = (0, import_react.useState)("MSG91");
	const [gateway, setGateway] = (0, import_react.useState)("Razorpay");
	const [gst, setGst] = (0, import_react.useState)("27ABCDE1234F1Z5");
	const [sliderImages, setSliderImages] = (0, import_react.useState)(getDemoSliderImages());
	const [showSliderForm, setShowSliderForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		title: "",
		description: "",
		imageUrl: "",
		link: ""
	});
	const handleAddSlider = () => {
		if (formData.title && formData.imageUrl) {
			if (editingId) updateDemoSliderImage(editingId, {
				title: formData.title,
				description: formData.description,
				imageUrl: formData.imageUrl,
				link: formData.link
			});
			else addDemoSliderImage({
				title: formData.title,
				description: formData.description,
				imageUrl: formData.imageUrl,
				link: formData.link,
				active: true
			});
			setSliderImages(getDemoSliderImages());
			setFormData({
				title: "",
				description: "",
				imageUrl: "",
				link: ""
			});
			setEditingId(null);
			setShowSliderForm(false);
		}
	};
	const handleImageUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const imageDataUrl = event.target?.result;
				setFormData({
					...formData,
					imageUrl: imageDataUrl
				});
			};
			reader.readAsDataURL(file);
		}
	};
	const handleDeleteSlider = (id) => {
		deleteDemoSliderImage(id);
		setSliderImages(getDemoSliderImages());
	};
	const handleToggleActive = (id) => {
		toggleDemoSliderImageActive(id);
		setSliderImages(getDemoSliderImages());
	};
	const handleEditSlider = (image) => {
		setEditingId(image.id);
		setFormData({
			title: image.title,
			description: image.description || "",
			imageUrl: image.imageUrl,
			link: image.link || ""
		});
		setShowSliderForm(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-semibold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6 text-primary" }), "Settings"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Configure the core gateway, notification and compliance preferences."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "System preferences"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SMS gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: sms,
									onChange: (e) => setSms(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment gateway" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: gateway,
									onChange: (e) => setGateway(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: gst,
									onChange: (e) => setGst(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Save preferences" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "Operational status"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									label: "SMS delivery",
									value: "Healthy"
								},
								{
									label: "Wallet syncing",
									value: "Healthy"
								},
								{
									label: "Settlement queue",
									value: "3 pending"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-2xl border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: item.value })]
							}, item.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4" }), " Bank accounts and compliance settings are ready for configuration."]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "Dashboard Slider Management"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setShowSliderForm(!showSliderForm),
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Image"]
						})]
					}),
					showSliderForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 space-y-4 rounded-lg border-2 border-dashed p-4 bg-slate-50 dark:bg-slate-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Image title",
								value: formData.title,
								onChange: (e) => setFormData({
									...formData,
									title: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Image description (optional)",
								value: formData.description,
								onChange: (e) => setFormData({
									...formData,
									description: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: handleImageUpload,
									className: "block w-full text-sm border rounded-lg p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
								}), formData.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mb-2",
										children: "Preview:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: formData.imageUrl,
										alt: "Preview",
										className: "h-32 w-full rounded object-cover"
									})]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link URL (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "https://example.com",
								value: formData.link,
								onChange: (e) => setFormData({
									...formData,
									link: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleAddSlider,
									disabled: !formData.title || !formData.imageUrl,
									children: editingId ? "Update Image" : "Add Image"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => {
										setShowSliderForm(false);
										setEditingId(null);
										setFormData({
											title: "",
											description: "",
											imageUrl: "",
											link: ""
										});
									},
									children: "Cancel"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [sliderImages.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-lg border p-4 hover:bg-slate-50 dark:hover:bg-slate-900",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: image.imageUrl,
									alt: image.title,
									className: "h-16 w-24 rounded object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-medium",
										children: image.title
									}), image.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: image.description
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => handleToggleActive(image.id),
											title: image.active ? "Hide" : "Show",
											children: image.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => handleEditSlider(image),
											children: "Edit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "text-red-500 hover:text-red-700",
											onClick: () => handleDeleteSlider(image.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})
							]
						}, image.id)), sliderImages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No slider images added yet. Add one to get started!"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
