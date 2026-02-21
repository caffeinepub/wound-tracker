import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ColorCompositionDisplayProps {
  red: number;
  pink: number;
  yellow: number;
  black: number;
}

export default function ColorCompositionDisplay({
  red,
  pink,
  yellow,
  black
}: ColorCompositionDisplayProps) {
  const healthyPercentage = red + pink;
  const concernPercentage = yellow + black;
  
  const overallStatus = healthyPercentage > concernPercentage ? 'good' : 'concern';

  return (
    <Card className="border-2 border-primary/20 shadow-medical">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <CardTitle className="text-lg">Color Composition Analysis</CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className={overallStatus === 'good' 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-destructive/10 text-destructive border-destructive/20'
            }
          >
            {overallStatus === 'good' ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {overallStatus === 'good' ? 'Positive Signs' : 'Needs Attention'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Critical metric for assessing wound healing progress
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-medical-red" />
                Red (Healthy Granulation)
              </span>
              <span className="text-sm font-bold">{red.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-medical-red transition-all duration-500"
                style={{ width: `${red}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Good healing indicator</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-medical-pink" />
                Pink (New Skin Formation)
              </span>
              <span className="text-sm font-bold">{pink.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-medical-pink transition-all duration-500"
                style={{ width: `${pink}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Epithelialization progress</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-medical-yellow" />
                Yellow (Slough/Dead Tissue)
              </span>
              <span className="text-sm font-bold">{yellow.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-medical-yellow transition-all duration-500"
                style={{ width: `${yellow}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">May slow healing</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-medical-black" />
                Black (Necrotic Tissue)
              </span>
              <span className="text-sm font-bold">{black.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-medical-black transition-all duration-500"
                style={{ width: `${black}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Healthy Tissue:</span>
            <span className="font-semibold text-success">{healthyPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Concerning Tissue:</span>
            <span className="font-semibold text-destructive">{concernPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
