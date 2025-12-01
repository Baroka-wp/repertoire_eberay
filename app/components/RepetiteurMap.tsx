'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix pour les icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Coordonnées approximatives des principales villes du Niger
const COORDONNEES_VILLES: Record<string, [number, number]> = {
  "Niamey": [13.5127, 2.1128],
  "Dosso": [13.0430, 3.1940],
  "Gaya": [11.8844, 3.4483],
  "Doutchi": [13.3397, 3.9050],
  "Loga": [13.9167, 3.5333],
  "Maradi": [13.5000, 7.1017],
  "Tessaoua": [13.7550, 8.0067],
  "Dakoro": [14.5108, 6.7658],
  "Mayahi": [13.9560, 7.6710],
  "Tahoua": [14.8888, 5.2692],
  "Abalak": [15.4519, 6.2808],
  "Birni-N'Konni": [13.7958, 5.2500],
  "Madaoua": [14.0742, 5.9608],
  "Zinder": [13.8078, 8.9883],
  "Magaria": [12.9969, 8.9092],
  "Gouré": [13.9883, 10.2700],
  "Mirriah": [13.7072, 9.1489],
  "Agadez": [16.9736, 7.9911],
  "Arlit": [18.7369, 7.3858],
  "Bilma": [18.6869, 12.9172],
  "Tchirozérine": [17.4708, 7.5503],
  "Diffa": [13.3154, 12.6113],
  "N'Guigmi": [14.2506, 13.1108],
  "Maïné-Soroa": [13.2133, 12.0244],
  "Tillabéri": [14.2111, 1.4528],
  "Tera": [14.0083, 0.7542],
  "Filingué": [14.3522, 3.3172],
  "Say": [13.0981, 2.3689],
  "Kollo": [13.3167, 2.3333],
}

interface Repetiteur {
  id: number
  nom: string
  prenom: string
  ville: string
  departement: string
  telephone: string
  matieres: string
  diplome: string
}

interface RepetiteurMapProps {
  repetiteurs: Repetiteur[]
}

export default function RepetiteurMap({ repetiteurs }: RepetiteurMapProps) {
  useEffect(() => {
    // Forcer le resize de la carte après le montage
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Grouper les répétiteurs par ville
  const repetiteursParVille = repetiteurs.reduce((acc, rep) => {
    if (!acc[rep.ville]) {
      acc[rep.ville] = []
    }
    acc[rep.ville].push(rep)
    return acc
  }, {} as Record<string, Repetiteur[]>)

  // Centre de la carte sur le Niger
  const center: [number, number] = [15.0, 8.0]

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Object.entries(repetiteursParVille).map(([ville, reps]) => {
          const coords = COORDONNEES_VILLES[ville]
          if (!coords) return null

          return (
            <Marker key={ville} position={coords}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-slate-900 mb-2 text-base">{ville}</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {reps.length} répétiteur{reps.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {reps.map(rep => (
                      <div key={rep.id} className="border-t border-neutral-200 pt-2">
                        <a 
                          href={`/repetiteur/${rep.id}`}
                          className="font-semibold text-slate-800 hover:text-slate-900 text-sm"
                        >
                          {rep.prenom} {rep.nom}
                        </a>
                        <p className="text-xs text-slate-500">{rep.diplome}</p>
                        <p className="text-xs text-slate-600 mt-1">{rep.telephone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

