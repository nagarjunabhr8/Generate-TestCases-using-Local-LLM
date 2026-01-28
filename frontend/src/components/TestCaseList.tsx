
import React from 'react';
import type { TestCasesResponse } from '../types';
import { CheckCircle2, AlertTriangle, ListOrdered } from 'lucide-react';

interface TestCaseListProps {
    data: TestCasesResponse;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        High: 'bg-red-500/20 text-red-300 border-red-500/50',
        Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        Low: 'bg-green-500/20 text-green-300 border-green-500/50',
    };
    const colorClass = colors[priority as keyof typeof colors] || colors.Medium;

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
            {priority}
        </span>
    );
};

const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
        Positive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        Negative: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    };
    // Default fallback
    const colorClass = colors[type as keyof typeof colors] || 'bg-blue-500/20 text-blue-300 border-blue-500/50';

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {type}
        </span>
    );
};

export const TestCaseList: React.FC<TestCaseListProps> = ({ data }) => {
    if (!data.testCases || data.testCases.length === 0) {
        return <div className="text-slate-400 italic">No test cases found in response.</div>;
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-200">Generated Test Cases ({data.testCases.length})</h3>
            </div>

            <div className="grid gap-4">
                {data.testCases.map((tc, idx) => (
                    <div
                        key={idx}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300 shadow-sm"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div className="flex items-start gap-3">
                                <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded pt-1.5">{tc.id || `TC_${idx + 1}`}</span>
                                <h4 className="font-semibold text-slate-100 leading-tight">{tc.title}</h4>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <PriorityBadge priority={tc.priority} />
                                <TypeBadge type={tc.type} />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">

                            {/* Left Col: Preconditions & Steps */}
                            <div className="space-y-3">
                                {tc.preconditions && tc.preconditions.length > 0 && (
                                    <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <AlertTriangle className="w-3 h-3" /> Preconditions
                                        </div>
                                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                                            {tc.preconditions.map((pre, i) => (
                                                <li key={i}>{pre}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <ListOrdered className="w-3 h-3" /> Test Steps
                                    </div>
                                    <ol className="list-decimal list-inside text-slate-300 space-y-1 pl-1">
                                        {tc.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            {/* Right Col: Expected Result */}
                            <div>
                                <div className="bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/10 h-full">
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                                        <CheckCircle2 className="w-3 h-3" /> Expected Result
                                    </div>
                                    <p className="text-emerald-100/90 leading-relaxed">
                                        {tc.expected_result}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
