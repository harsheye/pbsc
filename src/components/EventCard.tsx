import { IKImage } from 'imagekitio-react';
import { imagekitConfig } from '@/config/imagekit';

export function EventCard({ event }: { event: IEvent }) {
  return (
    <div className="...">
      {event.image && (
        <div className="relative h-48">
          <IKImage
            urlEndpoint={imagekitConfig.urlEndpoint}
            path={event.image.replace(imagekitConfig.urlEndpoint, '')}
            transformation={[{
              height: '300',
              width: '400',
              quality: '80',
              crop: 'maintain_ratio'
            }]}
            loading="lazy"
            lqip={{ active: true }}
            alt={event.title}
          />
        </div>
      )}
      {/* ... rest of the card content ... */}
    </div>
  );
} 