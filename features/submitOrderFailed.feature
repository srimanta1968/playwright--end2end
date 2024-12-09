Feature: Submit order Failed

  Scenario: Submit the shipping order form to fail
    When I select "United States of America" in the country box
    And I click the "Submit Order" button
    Then I receive a successful order placed message
    And I made this step to fail
