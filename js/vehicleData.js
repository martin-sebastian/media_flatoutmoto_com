/**
 * Fetches vehicle inventory from Supabase next_universal_unit_inventory.
 * Maps rows to app item shape for compatibility with processVehicleData.
 */
import { supabase, isSupabaseConfigured } from './supabase.js';

/** Maps a Supabase row to the app item shape (matches processXMLData output). */
function mapRowToAppItem(row) {
	const images = Array.isArray(row.images) ? row.images : [];
	const imageUrl = images[0] || 'N/A';
	const price = row.price != null ? String(row.price) : 'N/A';
	const year = row.year != null ? String(row.year) : 'N/A';
	// Use updated_at (last sync) when more recent than feed's updated; feed dates can be stale
	const feedUpdated = row.updated ? new Date(row.updated).getTime() : 0;
	const syncUpdated = row.updated_at ? new Date(row.updated_at).getTime() : 0;
	const bestDate = syncUpdated >= feedUpdated && syncUpdated > 0 ? row.updated_at : row.updated;
	const updated = bestDate
		? new Date(bestDate).toISOString().replace('T', ' ').slice(0, 19)
		: 'N/A';

	return {
		imageUrl,
		title: row.title || 'N/A',
		webURL: row.link || 'N/A',
		stockNumber: row.stocknumber || 'N/A',
		vin: row.vin || 'N/A',
		price,
		webPrice: typeof numeral !== 'undefined' ? numeral(price).format('$0,0.00') : price,
		manufacturer: row.manufacturer || 'N/A',
		year,
		modelName: row.model_name || 'N/A',
		modelType: row.model_type || 'N/A',
		modelCode: 'N/A', // not in Supabase schema
		color: row.color || 'N/A',
		usage: row.usage || 'N/A',
		updated,
		imageElements: images.length,
	};
}

/**
 * Fetches vehicles from Supabase next_universal_unit_inventory.
 * @returns {Promise<Array|null>} Mapped items or null if Supabase not configured/fails.
 */
export async function fetchVehiclesFromSupabase() {
	if (!isSupabaseConfigured()) return null;

	const table = import.meta.env?.VITE_SUPABASE_INVENTORY_TABLE || 'next_universal_unit_inventory';
	try {
		const { data, error } = await supabase
			.from(table)
			.select('*')
			.order('updated', { ascending: false });

		if (error) {
			console.error('Supabase fetch error:', error);
			return null;
		}

		return (data || []).map(mapRowToAppItem);
	} catch (err) {
		console.error('Supabase fetch exception:', err);
		return null;
	}
}
