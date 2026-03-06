
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Initialize Database
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to start the database initialization process.
        </p>
        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
          Start Initialization
        </Button>
        <div className="mt-6">
          <Progress value={10} className="h-1 bg-indigo-500/20" />
          <p className="mt-2 text-gray-500 text-sm">
            Initialization progress: 10%
          </p>
        </div>
      </div>
    </div>
  );
}

