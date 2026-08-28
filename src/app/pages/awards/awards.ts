import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorsIcon } from '../doctors/doctors-icon';

interface StatItem {
  icon: string;
  value: string;
  label: string;
}

interface AwardItem {
  title: string;
  award: string;
  description: string;
  image: string;
}

interface RecognizedDoctor {
  name: string;
  title: string;
  credentials: string;
  image: string;
}

interface GalleryPhoto {
  image: string;
  caption: string;
}

/**
 * Awards & Recognition - the "/awards" page.
 *
 * Every award/date/credential below was read directly off the certificate,
 * medal and plaque photography in public/Images/Awards-Images (not off the
 * old CSR site, which renders its award content client-side and can't be
 * fetched) - so the copy quotes what the physical awards actually say
 * rather than guessing from filenames alone.
 */
@Component({
  selector: 'app-awards-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon],
  templateUrl: './awards.html',
  styleUrl: './awards.css',
})
export class AwardsPage {
  protected readonly stats: StatItem[] = [
    { icon: 'trophy', value: '4', label: 'Major Awards & Honors' },
    { icon: 'badge', value: 'Top 10', label: 'Orthopaedics Ranking in India' },
    { icon: 'star', value: '3', label: 'Doctors Individually Ranked' },
  ];

  /** The four headline recognitions, newest first within each Times Group
   *  ceremony pairing kept together where it reads better chronologically. */
  protected readonly featuredAwards: AwardItem[] = [
    {
      title: 'Most Trusted Tertiary Care Hospital',
      award: 'Times Business Awards, Bengaluru 2022',
      description:
        'Recognized by The Times Group for the trust patients place in Vasavi Hospitals as a tertiary care provider.',
      image: '/Images/Awards-Images/vasavi-hospitals-doctor-times-business-award.jpg',
    },
    {
      title: 'Excellence in Neurosciences',
      award: 'Times Health Excellence, Bengaluru 2022',
      description:
        'Honored for the outcomes and expertise delivered across our Neurosciences and Neurosurgery programs.',
      image: '/Images/Awards-Images/Times%20Business%20Awards%202022%20Neuro%20Surgery%20(4).jpg',
    },
    {
      title: 'Excellence in Mother & Child Health',
      award: 'Times Health Excellence, Bangalore 2023',
      description:
        'Celebrated for the quality of care delivered across our Obstetrics, Gynaecology and Neonatal teams.',
      image: '/Images/Awards-Images/vasavi-hospitals-times-health-excellence-award.jpg',
    },
    {
      title: '7th in India for Orthopaedics',
      award: 'Times of India All India Lifestyle Hospital & Clinic Ranking Survey, 2022',
      description:
        'Ranked among the top city hospitals nationally for our Orthopaedics department, in the City Hospitals category.',
      image: '/Images/Awards-Images/vasavi-hospitals-orthopaedics-ranking-7th-india.jpg',
    },
  ];

  /** The three Orthopaedics consultants individually featured in the Times
   *  of India national ranking survey above - names/titles/credentials
   *  transcribed verbatim from each doctor's own certificate graphic. */
  protected readonly recognizedDoctors: RecognizedDoctor[] = [
    {
      name: 'Dr. Rupendu Thongavalen',
      title: 'Director, Dept. of Orthopaedics',
      credentials: 'MBBS, D.Ortho, MS (Ortho), Fellowship in Joint Replacement Surgery (Australia, Germany)',
      image: '/Images/Awards-Images/vasavi-hospitals-times-business-award.jpg',
    },
    {
      name: 'Dr. Srivatsa Subramanya',
      title: 'Consultant Orthopaedics',
      credentials:
        'MBBS, MS, DNB, Fellowship in Knee (Australia), Fellowship Shoulder & Elbow (Australia & Italy), Fellowship Orthopaedic Trauma (South Korea)',
      image: '/Images/Awards-Images/vasavi-hospitals-orthopaedics-ranking-dr-srivatsa.jpg',
    },
    {
      name: 'Dr. Venkatesh Rathod R',
      title: 'Consultant Orthopaedics',
      credentials: 'MBBS, D.Ortho, DNB (Ortho)',
      image: '/Images/Awards-Images/vasavi-hospitals-orthopaedics-ranking-dr-venkatesh.jpg',
    },
  ];

  /** Ceremony/backstage photography rounding out the story behind the four
   *  featured awards above. */
  protected readonly galleryPhotos: GalleryPhoto[] = [
    {
      image: '/Images/Awards-Images/vasavi-hospitals-awards-certificates-bangalore.jpg',
      caption: 'The Times Health Excellence 2023 certificate, medal and plaque for Excellence in Mother & Child Health.',
    },
    {
      image: '/Images/Awards-Images/vasavi-hospitals-doctors-with-awards-bangalore.jpg',
      caption: 'Our team on stage at the Times Health Excellence 2023 awards in Bangalore.',
    },
    {
      image: '/Images/Awards-Images/vasavi-hospitals-health-excellence-award-ceremony.jpg',
      caption: 'Backstage at Times Health Excellence 2023, moments after receiving the award.',
    },
    {
      image: '/Images/Awards-Images/vasavi-hospitals-times-health-excellence-award-ceremony.jpg',
      caption: 'Accepting the Times Business Awards 2022 trophy for Most Trusted Tertiary Care Hospital.',
    },
    {
      image: '/Images/Awards-Images/vasavi-hospitals-awards-times-health-excellence.jpg',
      caption: 'Representing Vasavi Hospitals at Times Health Excellence 2022, for Excellence in Neurosciences.',
    },
  ];
}
