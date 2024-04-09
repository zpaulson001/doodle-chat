import DrawingPad from './drawingPad';
import { Card, CardContent, CardFooter } from './ui/card';

export default function Chat() {
  return (
    <Card>
      <CardContent></CardContent>
      <CardFooter>
        <DrawingPad />
      </CardFooter>
    </Card>
  );
}
