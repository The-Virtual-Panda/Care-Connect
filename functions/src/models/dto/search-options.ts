/**
 * Base search options interface for pagination
 */
export interface BaseSearchOptions {
    pageSize?: number;
    pageNumber?: number;
}

/**
 * Date range for filtering
 */
export interface DateRangeFilter {
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
}

/**
 * Phone number filter options
 */
export interface PhoneNumberFilter {
    from?: string;
    to?: string;
}
