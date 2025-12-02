import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio {
  id: string;
  subdomain: string;
  status: 'draft' | 'published';
  visibility: 'private' | 'public';
  portfolio_data: any;
  created_at: string;
  updated_at: string;
}

interface PortfolioContextType {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  createPortfolio: (data: any) => Promise<Portfolio>;
  updatePortfolio: (data: Partial<Portfolio>) => Promise<void>;
  publishPortfolio: () => Promise<void>;
  unpublishPortfolio: () => Promise<void>;
  updateVisibility: (visibility: 'private' | 'public') => Promise<void>;
  loadPortfolio: (subdomain: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPortfolio = async (data: any): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const { data: portfolioData, error } = await supabase
        .from('portfolios')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      setPortfolio(portfolioData);
      return portfolioData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create portfolio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async (subdomain: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('subdomain', subdomain)
        .eq('visibility', 'public')
        .single();

      if (error) throw error;
      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolio = async (data: Partial<Portfolio>) => {
    if (!portfolio) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update(data)
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolio({ ...portfolio, ...data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio');
    }
  };

  const publishPortfolio = async () => {
    if (!portfolio) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ status: 'published' })
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolio({ ...portfolio, status: 'published' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish portfolio');
    }
  };

  const unpublishPortfolio = async () => {
    if (!portfolio) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ status: 'draft' })
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolio({ ...portfolio, status: 'draft' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish portfolio');
    }
  };

  const updateVisibility = async (visibility: 'private' | 'public') => {
    if (!portfolio) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ visibility })
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolio({ ...portfolio, visibility });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update visibility');
    }
  };

  return (
    <PortfolioContext.Provider value={{
      portfolio,
      loading,
      error,
      createPortfolio,
      loadPortfolio,
      updatePortfolio,
      publishPortfolio,
      unpublishPortfolio,
      updateVisibility
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
