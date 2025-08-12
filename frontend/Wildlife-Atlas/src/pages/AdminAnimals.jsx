import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HABITATS = [
  { value: '', label: 'Habitat' },
  { value: 'kopno', label: 'Kopno' },
  { value: 'voda', label: 'Voda' },
  { value: 'vozduh', label: 'Vozduh' },
];

export default function AdminAnimals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [form, setForm] = useState({
    name: '',
    habitat: '',
    family: '',
    lifespan: '',
    diet: '',
    origin: '',
    sound: '',
    prey: '',
    predators: '',
    // ✅ card fields
    cardImage: '',
    summary: '',
    featured: true,
  });

  async function fetchAnimals() {
    try {
      const res = await fetch(`${API}/api/animals`);
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    }
  }

  useEffect(() => { fetchAnimals(); }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function onChangeHabitat(e) {
    setForm(prev => ({ ...prev, habitat: e.target.value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    if (!['kopno', 'voda', 'vozduh'].includes(form.habitat)) {
      alert('Habitat must be one of: kopno, voda, vozduh');
      return;
    }
    setLoading(true);
    try {
      const body = {
        ...form,
        // backend expects arrays — convert comma-separated strings
        prey: form.prey.split(',').map(s => s.trim()).filter(Boolean),
        predators: form.predators.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${API}/api/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Create failed');
      await fetchAnimals();
      setForm({
        name: '',
        habitat: '',
        family: '',
        lifespan: '',
        diet: '',
        origin: '',
        sound: '',
        prey: '',
        predators: '',
        cardImage: '',
        summary: '',
        featured: true,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this animal?')) return;
    try {
      const res = await fetch(`${API}/api/animals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setList(prev => prev.filter(x => x._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin • Animals</h1>

      {/* Token input (replace with your real auth flow) */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Paste admin JWT here"
          value={token}
          onChange={e => { setToken(e.target.value); localStorage.setItem('token', e.target.value); }}
        />
        <Badge>{token ? 'Token set' : 'No token'}</Badge>
      </div>

      {/* Create form */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input name="name" value={form.name} onChange={onChange} placeholder="Name" required />

            {/* Habitat select to avoid typos */}
            <select
              name="habitat"
              value={form.habitat}
              onChange={onChangeHabitat}
              className="h-10 rounded-md border px-3 text-sm"
              required
            >
              {HABITATS.map(h => (
                <option key={h.value} value={h.value} disabled={h.value === ''}>
                  {h.label}
                </option>
              ))}
            </select>

            <Input name="family" value={form.family} onChange={onChange} placeholder="Family" />
            <Input name="lifespan" value={form.lifespan} onChange={onChange} placeholder="Lifespan" />
            <Input name="diet" value={form.diet} onChange={onChange} placeholder="Diet" />
            <Input name="origin" value={form.origin} onChange={onChange} placeholder="Origin" />
            <Input name="sound" value={form.sound} onChange={onChange} placeholder="Sound (filename/URL)" />

            <Input name="prey" value={form.prey} onChange={onChange} placeholder="Prey (comma-separated)" />
            <Input name="predators" value={form.predators} onChange={onChange} placeholder="Predators (comma-separated)" />

            {/* ✅ Card image + summary + featured */}
            <Input
              name="cardImage"
              value={form.cardImage}
              onChange={onChange}
              placeholder="Card image (URL)"
              className="md:col-span-3"
            />

            <textarea
              name="summary"
              value={form.summary}
              onChange={onChange}
              placeholder="Short summary for card (1–2 lines)"
              className="min-h-[90px] rounded-md border p-2 text-sm md:col-span-3"
            />

            <label className="flex items-center gap-2 text-sm md:col-span-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={onChange}
              />
              Show on habitat cards (featured)
            </label>

            <div className="md:col-span-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Add Animal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Card</th>
              <th className="p-2">Name</th>
              <th className="p-2">Habitat</th>
              <th className="p-2">Diet</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a._id} className="border-b hover:bg-black/5">
                <td className="p-2">
                  {a.cardImage ? (
                    <img
                      src={a.cardImage}
                      alt=""
                      className="w-16 h-12 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="p-2 font-medium">
                  <div className="flex flex-col">
                    <span>{a.name}</span>
                    {a.summary ? (
                      <span className="text-xs text-gray-500 line-clamp-2">{a.summary}</span>
                    ) : null}
                  </div>
                </td>
                <td className="p-2">{a.habitat}</td>
                <td className="p-2">{a.diet}</td>
                <td className="p-2">{a.featured === false ? 'No' : 'Yes'}</td>
                <td className="p-2">
                  <Button variant="destructive" onClick={() => onDelete(a._id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>No animals yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
