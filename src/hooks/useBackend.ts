"use client";

import { useState, useEffect } from 'react';
import { 
  fetchDashboardTelemetry, 
  fetchAssetCatalogItems, 
  fetchAnalyticsGraphs,
  DashboardTelemetry,
  AssetCatalogItem,
  AnalyticsGraph
} from '../lib/api';

export function useDashboardData() {
  const [data, setData] = useState<DashboardTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const telemetry = await fetchDashboardTelemetry();
        setData(telemetry);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { data, loading, error };
}

export function useAssets() {
  const [data, setData] = useState<AssetCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const assets = await fetchAssetCatalogItems();
        setData(assets);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { data, loading, error };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsGraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const analytics = await fetchAnalyticsGraphs();
        setData(analytics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { data, loading, error };
}
