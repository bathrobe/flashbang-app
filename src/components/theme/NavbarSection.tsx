"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { PlaygroundSection, SampleLabel } from "./PlaygroundSection";
import { doNothingLater } from "./sampleData";
import { SampleHud } from "./SampleHud";

const sampleNavbarProps = {
  userName: "Sample Learner",
  userImage: null,
  nextDueDate: "2026-11-20",
  showAuthorLink: true,
  saveSoundOn: doNothingLater, // the speaker here changes only this sample, never the account
};

// The real navbar with sample numbers: once with atoms due (badge), once with none.
export function NavbarSection() {
  return (
    <PlaygroundSection title="Navbar" group="navbar">
      <SampleLabel>3 due: badge</SampleLabel>
      <div data-navbar-sample="badge">
        <SampleHud sampleValues={{ clout: 240, learnerLevel: 4, dueCount: 3 }}>
          <Navbar {...sampleNavbarProps} />
        </SampleHud>
      </div>
      <SampleLabel>nothing due: no badge</SampleLabel>
      <div data-navbar-sample="no-badge">
        <SampleHud sampleValues={{ clout: 0, learnerLevel: 1, dueCount: 0 }}>
          <Navbar {...sampleNavbarProps} />
        </SampleHud>
      </div>
    </PlaygroundSection>
  );
}
