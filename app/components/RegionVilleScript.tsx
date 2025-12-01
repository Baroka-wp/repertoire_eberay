'use client'

import { useEffect } from 'react'

const VILLES_PAR_REGION: Record<string, string[]> = {
  "Niamey": ["Niamey"],
  "Dosso": ["Dosso", "Gaya", "Doutchi", "Loga"],
  "Maradi": ["Maradi", "Tessaoua", "Dakoro", "Mayahi"],
  "Tahoua": ["Tahoua", "Abalak", "Birni-N'Konni", "Madaoua"],
  "Zinder": ["Zinder", "Magaria", "Gouré", "Mirriah"],
  "Agadez": ["Agadez", "Arlit", "Bilma", "Tchirozérine"],
  "Diffa": ["Diffa", "N'Guigmi", "Maïné-Soroa"],
  "Tillabéri": ["Tillabéri", "Tera", "Filingué", "Say", "Kollo"],
}

export default function RegionVilleScript() {
  useEffect(() => {
    const regionSelect = document.getElementById('region') as HTMLSelectElement
    const villeSelect = document.getElementById('ville') as HTMLSelectElement

    if (!regionSelect || !villeSelect) return

    const handleRegionChange = () => {
      const region = regionSelect.value
      const villes = region ? VILLES_PAR_REGION[region] || [] : []
      const currentVille = villeSelect.value

      // Vider les options existantes sauf la première
      while (villeSelect.options.length > 1) {
        villeSelect.remove(1)
      }

      // Ajouter les nouvelles options
      villes.forEach(ville => {
        const option = document.createElement('option')
        option.value = ville
        option.textContent = ville
        villeSelect.appendChild(option)
      })

      // Restaurer la sélection si valide
      if (villes.includes(currentVille)) {
        villeSelect.value = currentVille
      } else {
        villeSelect.value = ''
      }

      villeSelect.disabled = !region
    }

    regionSelect.addEventListener('change', handleRegionChange)

    return () => {
      regionSelect.removeEventListener('change', handleRegionChange)
    }
  }, [])

  return null
}

