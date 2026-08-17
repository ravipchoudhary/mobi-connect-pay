import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, ShieldCheck, BellRing, Banknote, Image, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDemoSliderImages, addDemoSliderImage, updateDemoSliderImage, deleteDemoSliderImage, toggleDemoSliderImageActive } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [sms, setSms] = useState("MSG91");
  const [gateway, setGateway] = useState("Razorpay");
  const [gst, setGst] = useState("27ABCDE1234F1Z5");
  const [sliderImages, setSliderImages] = useState(getDemoSliderImages());
  const [showSliderForm, setShowSliderForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", imageUrl: "", link: "" });

  const handleAddSlider = () => {
    if (formData.title && formData.imageUrl) {
      if (editingId) {
        updateDemoSliderImage(editingId, {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          link: formData.link,
        });
      } else {
        addDemoSliderImage({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          link: formData.link,
          active: true,
        });
      }
      setSliderImages(getDemoSliderImages());
      setFormData({ title: "", description: "", imageUrl: "", link: "" });
      setEditingId(null);
      setShowSliderForm(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setFormData({ ...formData, imageUrl: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSlider = (id: string) => {
    deleteDemoSliderImage(id);
    setSliderImages(getDemoSliderImages());
  };

  const handleToggleActive = (id: string) => {
    toggleDemoSliderImageActive(id);
    setSliderImages(getDemoSliderImages());
  };

  const handleEditSlider = (image: any) => {
    setEditingId(image.id);
    setFormData({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      link: image.link || "",
    });
    setShowSliderForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Settings className="h-6 w-6 text-primary" />Settings</h1><p className="text-sm text-muted-foreground">Configure the core gateway, notification and compliance preferences.</p></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">System preferences</h2></div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>SMS gateway</Label><Input value={sms} onChange={(e) => setSms(e.target.value)} /></div>
            <div className="space-y-2"><Label>Payment gateway</Label><Input value={gateway} onChange={(e) => setGateway(e.target.value)} /></div>
            <div className="space-y-2"><Label>GSTIN</Label><Input value={gst} onChange={(e) => setGst(e.target.value)} /></div>
            <Button>Save preferences</Button>
          </div>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Operational status</h2></div>
          <div className="space-y-3">
            {[
              { label: "SMS delivery", value: "Healthy" },
              { label: "Wallet syncing", value: "Healthy" },
              { label: "Settlement queue", value: "3 pending" },
            ].map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl border p-3"><div>{item.label}</div><Badge>{item.value}</Badge></div>)}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground"><Banknote className="h-4 w-4" /> Bank accounts and compliance settings are ready for configuration.</div>
        </Card>
      </div>

      {/* Image Slider Management */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Dashboard Slider Management</h2>
          </div>
          <Button size="sm" onClick={() => setShowSliderForm(!showSliderForm)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Image
          </Button>
        </div>

        {showSliderForm && (
          <div className="mb-6 space-y-4 rounded-lg border-2 border-dashed p-4 bg-slate-50 dark:bg-slate-900">
            <div><Label>Title</Label><Input placeholder="Image title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label>Description</Label><Input placeholder="Image description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div>
              <Label>Image</Label>
              <div className="mt-2 space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="block w-full text-sm border rounded-lg p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <img src={formData.imageUrl} alt="Preview" className="h-32 w-full rounded object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div><Label>Link URL (optional)</Label><Input placeholder="https://example.com" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} /></div>
            <div className="flex gap-2">
              <Button onClick={handleAddSlider} disabled={!formData.title || !formData.imageUrl}>{editingId ? "Update Image" : "Add Image"}</Button>
              <Button variant="outline" onClick={() => { setShowSliderForm(false); setEditingId(null); setFormData({ title: "", description: "", imageUrl: "", link: "" }); }}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {sliderImages.map((image: any) => (
            <div key={image.id} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
              <img src={image.imageUrl} alt={image.title} className="h-16 w-24 rounded object-cover" />
              <div className="flex-1">
                <h3 className="font-medium">{image.title}</h3>
                {image.description && <p className="text-sm text-muted-foreground">{image.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleToggleActive(image.id)} title={image.active ? "Hide" : "Show"}>
                  {image.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleEditSlider(image)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteSlider(image.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {sliderImages.length === 0 && <p className="text-sm text-muted-foreground">No slider images added yet. Add one to get started!</p>}
        </div>
      </Card>
    </div>
  );
}
