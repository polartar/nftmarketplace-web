import React, { memo } from 'react';
import { faBook, faCopy, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faInstagram, faMedium, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import LayeredIcon from '../components/LayeredIcon';
import { toast } from 'react-toastify';

const SocialsBar = ({ collection }) => {
  const handleCopy = (code) => () => {
    navigator.clipboard.writeText(code);
    toast.success('Address Copied!');
  };

  return (
    <div className="mt-2">
      {collection.metadata.website && (
        <a href={collection.metadata.website} target="_blank" title="View Website">
          <LayeredIcon icon={faGlobe} />
        </a>
      )}
      {collection.metadata.twitter && (
        <a href={collection.metadata.twitter} target="_blank" title="View Twitter">
          <LayeredIcon icon={faTwitter} />
        </a>
      )}
      {collection.metadata.discord && (
        <a href={collection.metadata.discord} target="_blank" title="View Discord">
          <LayeredIcon icon={faDiscord} />
        </a>
      )}
      {collection.metadata.telegram && (
        <a href={collection.metadata.telegram} target="_blank" title="View Telegram">
          <LayeredIcon icon={faTelegram} />
        </a>
      )}
      {collection.metadata.instagram && (
        <a href={collection.metadata.instagram} target="_blank" title="View Telegram">
          <LayeredIcon icon={faInstagram} />
        </a>
      )}
      {collection.metadata.medium && (
        <a href={collection.metadata.medium} target="_blank" title="View Medium">
          <LayeredIcon icon={faMedium} />
        </a>
      )}
      {collection.metadata.gitbook && (
        <a href={collection.metadata.gitbook} target="_blank" title="View Gitbook">
          <LayeredIcon icon={faBook} />
        </a>
      )}
      <span onClick={handleCopy(collection.address)} style={{ cursor: 'pointer' }} title="Copy Smart Contract Address">
        <LayeredIcon icon={faCopy} />
      </span>
    </div>
  );
};

export default memo(SocialsBar);
