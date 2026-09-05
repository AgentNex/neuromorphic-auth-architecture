import { insforge } from './insforge';

export interface DashboardTelemetry {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

export interface AssetCatalogItem {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface AnalyticsGraph {
  id: string;
  metric: string;
  data: any[];
}

export async function fetchDashboardTelemetry(): Promise<DashboardTelemetry[]> {
  const { data, error } = await insforge.database
    .from('metrics')
    .select('*');
    
  if (error) throw error;
  return data as DashboardTelemetry[];
}

export async function fetchAssetCatalogItems(): Promise<AssetCatalogItem[]> {
  const { data, error } = await insforge.database
    .from('assets')
    .select('*');
    
  if (error) throw error;
  return data as AssetCatalogItem[];
}

export async function fetchAnalyticsGraphs(): Promise<AnalyticsGraph[]> {
  const { data, error } = await insforge.database
    .from('analytics')
    .select('*');
    
  if (error) throw error;
  return data as AnalyticsGraph[];
}
