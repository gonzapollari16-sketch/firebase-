
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Property Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="location">Location</label>
              <Input id="location" placeholder="City, neighborhood, or address" />
            </div>
            <div className="space-y-2">
              <label htmlFor="price-min">Min. Price</label>
              <Input id="price-min" type="number" placeholder="Any" />
            </div>
            <div className="space-y-2">
              <label htmlFor="price-max">Max. Price</label>
              <Input id="price-max" type="number" placeholder="Any" />
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms">Bedrooms</label>
              <Input id="bedrooms" type="number" placeholder="Any" />
            </div>
            <div className="space-y-2">
              <label htmlFor="bathrooms">Bathrooms</label>
              <Input id="bathrooms" type="number" placeholder="Any" />
            </div>
            <div className="col-span-full space-y-4">
              <label>Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pool" />
                  <label htmlFor="pool">Pool</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gym" />
                  <label htmlFor="gym">Gym</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pet-friendly" />
                  <label htmlFor="pet-friendly">Pet-Friendly</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" />
                  <label htmlFor="parking">Parking</label>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <Button className="w-full">Search</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
