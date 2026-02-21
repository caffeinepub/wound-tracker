import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useGetAllMeasurements, useDeleteMeasurement } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function WoundHistory() {
  const { data: measurements, isLoading } = useGetAllMeasurements();
  const deleteMeasurement = useDeleteMeasurement();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (timestamp: bigint) => {
    const id = `wound-${timestamp}`;
    setDeletingId(id);
    try {
      await deleteMeasurement.mutateAsync(id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthStatus = (measurement: any) => {
    const healthyPercentage = measurement.redPercentage + measurement.pinkPercentage;
    const concernPercentage = measurement.yellowPercentage + measurement.blackPercentage;
    return healthyPercentage > concernPercentage ? 'improving' : 'concern';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!measurements || measurements.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Measurements Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start by analyzing a wound image to build your tracking history
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedMeasurements = [...measurements].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
          <CardDescription>
            Track wound healing progress over time
          </CardDescription>
        </CardHeader>
      </Card>

      {sortedMeasurements.map((measurement, index) => {
        const status = getHealthStatus(measurement);
        const healthyPercentage = measurement.redPercentage + measurement.pinkPercentage;
        
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 flex-shrink-0">
                  <img
                    src={measurement.image.getDirectURL()}
                    alt="Wound measurement"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {formatDate(measurement.timestamp)}
                        </h3>
                        <Badge 
                          variant="outline"
                          className={status === 'improving' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {status === 'improving' ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {status === 'improving' ? 'Improving' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Healthy tissue: {healthyPercentage.toFixed(1)}%
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={deletingId === `wound-${measurement.timestamp}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Measurement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this measurement? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(measurement.timestamp)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="text-sm font-semibold">{measurement.area.toFixed(0)} px²</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Circularity</p>
                      <p className="text-sm font-semibold">{(measurement.circularity * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Red Tissue</p>
                      <p className="text-sm font-semibold text-medical-red">{measurement.redPercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pink Tissue</p>
                      <p className="text-sm font-semibold text-medical-pink">{measurement.pinkPercentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Yellow Tissue</p>
                      <p className="text-sm font-semibold text-medical-yellow">{measurement.yellowPercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Black Tissue</p>
                      <p className="text-sm font-semibold text-medical-black">{measurement.blackPercentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Texture</p>
                      <p className="text-sm font-semibold">{(measurement.textureSmoothness * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Edge Sharpness</p>
                      <p className="text-sm font-semibold">{(measurement.edgeSharpness * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
